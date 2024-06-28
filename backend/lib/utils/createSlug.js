const createSlug = (title) => {
  title = title.toLowerCase();
  title = title.trim();
  title = title.replace(/\s+/g, "-");
  title = title.replace(/[^a-z0-9\-]+/g, "");
  title = title.substring(0, 45);
  return title;
};

module.exports = { createSlug };
