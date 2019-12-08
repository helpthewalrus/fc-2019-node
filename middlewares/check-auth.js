export const checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    return res.redirect("/api/user/login");
  }
};
