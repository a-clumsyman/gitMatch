from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
from datetime import datetime
from urllib.parse import quote_plus
import os
import requests

# Load environment variables
load_dotenv()

# Initialize FastAPI
app = FastAPI()

ALLOWED_ORIGINS = [
    "https://gitmatch.vercel.app",           # Production frontend
    "https://git-match-backend.vercel.app",  # Production backend
    "http://localhost:5173",                 # Local frontend
    "http://localhost:8000"                  # Local backend
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Setup
username = os.getenv("MONGO_USERNAME", "")
password = os.getenv("MONGO_PASSWORD", "")
cluster = os.getenv("MONGO_CLUSTER", "")
database_name = os.getenv("MONGO_DB", "")

# Validate environment variables
if not all([username, password, cluster, database_name]):
    raise ValueError("Missing required MongoDB environment variables")

# Construct connection string
connection_string = f"mongodb+srv://{quote_plus(username)}:{quote_plus(password)}@{cluster}/?retryWrites=true&w=majority"

try:
    # Add connection timeout and retry settings
    client = MongoClient(
        connection_string,
        server_api=ServerApi('1'),
        serverSelectionTimeoutMS=5000,
        connectTimeoutMS=5000,
        retryWrites=True
    )
    # Verify connection
    client.admin.command('ping')
    print("Successfully connected to MongoDB")
except Exception as e:
    print(f"Failed to connect to MongoDB: {str(e)}")
    raise

db = client[database_name]
users_collection = db.users
recent_users_collection = db.recent_users

# GitHub API Base URL
GITHUB_API_BASE = "https://api.github.com"

GITHUB_TOKEN = os.getenv('GITHUB_TOKEN')
GITHUB_HEADERS = {'Authorization': f'token {GITHUB_TOKEN}'} if GITHUB_TOKEN else {}

@app.get("/profile/{username}")
async def get_user_profile(username: str):
    cached_user = users_collection.find_one({"username": username})
    if cached_user:
        cached_user["_id"] = str(cached_user["_id"])
        last_updated = datetime.fromisoformat(cached_user["last_updated"].replace('Z', '+00:00'))
        if (datetime.utcnow() - last_updated).total_seconds() < 86400:
            return cached_user

    try:
        # Fetch user data
        user_response = requests.get(
            f"{GITHUB_API_BASE}/users/{username}",
            headers=GITHUB_HEADERS
        )
        user_response.raise_for_status()
        user_data = user_response.json()

        # Calculate account age
        created_at = datetime.strptime(user_data["created_at"], "%Y-%m-%dT%H:%M:%SZ")
        account_age_days = (datetime.utcnow() - created_at).days
        account_age_years = account_age_days / 365.25  # Account for leap years

        # Fetch latest repositories
        repos_response = requests.get(
            f"{GITHUB_API_BASE}/users/{username}/repos?sort=updated&per_page=2",
            headers=GITHUB_HEADERS
        )
        repos_response.raise_for_status()
        repos_data = repos_response.json()

        # Get languages for latest repos only
        language_stats = {}
        for repo in repos_data:
            if repo.get('language'):
                language_stats[repo['language']] = language_stats.get(repo['language'], 0) + 1

        current_time = datetime.utcnow()
        user_profile = {
            "username": user_data["login"],
            "avatar": user_data["avatar_url"],
            "bio": user_data.get("bio", "Explorer of the digital cosmos."),
            "repositories": user_data.get("public_repos", 0),
            "followers": user_data.get("followers", 0),
            "top_language": repos_data[0].get('language', "Unknown") if repos_data else "Unknown",
            "latest_repos": [{
                "name": repo["name"],
                "stars": repo["stargazers_count"],
                "description": repo.get("description", "A stellar project."),
                "url": repo["html_url"],
                "language": repo.get("language", "Unknown")
            } for repo in repos_data],
            "git_age": {
                "years": round(account_age_years, 1),
                "days": account_age_days
            },
            "created_at": user_data["created_at"],
            "last_updated": current_time.isoformat()
        }

        users_collection.update_one(
            {"username": username},
            {"$set": user_profile},
            upsert=True
        )

        # Update recent users
        recent_users_collection.update_one(
            {"username": user_data["login"]},
            {
                "$set": {
                    "username": user_data["login"],
                    "avatar": user_data["avatar_url"],
                    "timestamp": datetime.utcnow()
                }
            },
            upsert=True
        )

        return user_profile

    except requests.exceptions.RequestException as e:
        print(f"GitHub API error: {str(e)}")
        raise HTTPException(status_code=404, detail="User not found")

def calculate_collab_score(user1_data, user2_data):
    # Language compatibility (40 points)
    language_score = 0
    if user1_data['top_language'] == user2_data['top_language']:
        language_score = 40
    elif user1_data['top_language'] != 'Unknown' and user2_data['top_language'] != 'Unknown':
        language_score = 20  # Different but known languages can still be beneficial
    
    # Repository experience balance (30 points)
    repo_overlap_score = min(user1_data['repositories'], user2_data['repositories']) / max(user1_data['repositories'], user2_data['repositories']) * 30 if max(user1_data['repositories'], user2_data['repositories']) > 0 else 0
    
    # Community engagement (30 points)
    follower_score = min(30, (user1_data['followers'] + user2_data['followers']) / 10)
    
    # Calculate total score
    total_score = language_score + repo_overlap_score + follower_score
    
    return {
        "compatibility_score": round(total_score, 2),
        "language_score": language_score,
        "repo_overlap_score": round(repo_overlap_score, 2),
        "follower_score": round(follower_score, 2)
    }

@app.get("/collaboration-rating/{username1}/{username2}")
async def get_collaboration_rating(username1: str, username2: str):
    try:
        # Validate usernames are different
        if username1.lower() == username2.lower():
            raise HTTPException(
                status_code=400,
                detail="Please provide two different usernames"
            )

        # Get profiles for both users
        user1 = await get_user_profile(username1)
        user2 = await get_user_profile(username2)
        
        # Calculate detailed scores
        scores = calculate_collab_score(user1, user2)
        
        # Prepare response
        response = {
            "compatibility_score": scores["compatibility_score"],
            "details": {
                "language_score": scores["language_score"],
                "repo_overlap_score": scores["repo_overlap_score"],
                "follower_score": scores["follower_score"],
                "users": {
                    "user1": {
                        "username": username1,
                        "top_language": user1["top_language"],
                        "repositories": user1["repositories"],
                        "followers": user1["followers"]
                    },
                    "user2": {
                        "username": username2,
                        "top_language": user2["top_language"],
                        "repositories": user2["repositories"],
                        "followers": user2["followers"]
                    }
                }
            }
        }
        
        return response

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error calculating collaboration rating: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to calculate collaboration rating"
        )

@app.get("/recent-users")
async def get_recent_users():
    try:
        recent_users = list(recent_users_collection.find(
            {}, 
            {"username": 1, "avatar": 1, "_id": 0}
        ).sort("timestamp", -1).limit(3))
        return recent_users
    except Exception as e:
        print(f"Error fetching recent users: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch recent users")
