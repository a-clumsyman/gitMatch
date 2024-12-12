// Add at the beginning of your routes
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Add proper timeout handling
app.use((req, res, next) => {
  res.setTimeout(30000, () => {
    res.status(504).json({ error: 'Request timeout' });
  });
  next();
}); 