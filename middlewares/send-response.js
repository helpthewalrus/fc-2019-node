export const sendResponse = (req, res) => {
  res
    .status(req.status || 200)
    .type("json")
    .send(req.data || "Response is accepted");
};
