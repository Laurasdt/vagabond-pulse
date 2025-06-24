const User = require("../models/user.model");
const Event = require("../model/event.model");

exports.list = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, parseInt(req.query.limit) || 10);
  const offset = (page - 1) * limit;
  const { count, rows } = await Event.findAndCountAll({
    include: [{ model: User, as: "owner", attributes: ["pseudo"] }],
    order: [["date", "DESC"]],
    limit,
    offset,
  });
  res.json({
    page,
    limit,
    total: count,
    totalPages: Math.ceil(count / limit),
    events: rows,
  });
};
exports.show = async (req, res) => {
  const eventId = req.params.eventId;
  const events = await Event.findByPk(eventId, {
    include: [{ model: User, as: "owner", attributes: ["pseudo"] }],
  });
  res.json(events);
};
