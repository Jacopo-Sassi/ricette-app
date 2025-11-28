function errorHandler(err, req, res, next) {
  console.error("🔥 ERRORE BACKEND:", err);

  res.status(err.statusCode || 500).json({
    error: err.message || "Errore interno del server",
  });
}

module.exports = errorHandler;
