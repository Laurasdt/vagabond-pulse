const User = require("../model/user.model");
const Event = require("../model/event.model");

exports.list = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1); // Il faudra ajouter un try/catch
  const limit = Math.max(1, parseInt(req.query.limit) || 10);
  const offset = (page - 1) * limit;
  const { count, rows } = await Event.findAndCountAll({ //.findAndCountAll est natif à Sequelize
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

exports.create = async (req, res) => {
  const { title, date, location, description } = req.body;
  const userId = req.user.id;
  const event = await Event.create({ // insère des données dans la table event
    title: title,
    date: date,
    location: location,
    description: description,
    userId: userId,
  });
  res.status(201).json({ id: event.id, message: "Evenement crée avec succès" });
};

exports.update = async (req, res) => {
  const { eventId } = req.params;
  const { title, date, location, description } = req.body;
  const condition =
    req.user.role === "admin"
      ? { id: eventId }
      : { id: eventId, userId: req.user.id };
  const [updated] = await Event.update(
    { title, date, location, description },
    { where: condition }
  );
  if (!updated) {
    return res.status(404).json({ error: "Accès refusé ou non autorisé" });
  }
  res.json({ message: "Evenement mis à jour" });
};

exports.destroy = async (req, res) => {
  const { eventId } = req.params;
  const preCondition =
    req.user.role === "admin"
      ? { id: eventId }
      : { id: eventId, userId: req.user.id };
  const deleted = await Event.destroy({ where: preCondition });
  if (!deleted) {
    return res.status(404).json({ error: "Introuvable" });
  }
  res.json({ message: "Element supprimé avec succès" });
};
