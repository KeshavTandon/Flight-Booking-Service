const {StatusCodes} =require('http-status-codes');
const {Enum} =require('../utils/common')
const {Booking} =require('../models');
const { Op } = require("sequelize");
const CrudRepository = require('./crud-repository');

class BookingRepository extends CrudRepository {
  constructor() {
    super(Booking);
  }

  async createBooking(data, transaction) {
    const response = await Booking.create(data, { transaction: transaction });
    return response;
  }

  async get(data, transaction) {
    const response = await this.model.findByPk(data, {
      transaction: transaction,
    });
    if (!response) {
      throw new AppError(
        "Not able to fund the resource",
        StatusCodes.NOT_FOUND
      );
    }
    return response;
  }

  async update(id, data, transaction) {
    // data -> {col: value, ....}
    const response = await this.model.update(
      data,
      {
        where: {
          id: id,
        },
      },
      { transaction: transaction }
    );
    return response;
  }

  async cancelOldBookings(timestamp) {
    const response = await Booking.update(
      { status: Enum.BOOKING_STATUS.CANCELLED },
      {
        where: {
          [Op.and]: [
            {
              createdAt: {
                [Op.lt]: timestamp,
              },
            },
            {
              status: {
                [Op.ne]: Enum.BOOKING_STATUS.BOOKED,
              },
            },
            {
              status: {
                [Op.ne]: Enum.BOOKING_STATUS.CANCELLED,
              },
            },
          ],
        },
      }
    );
    return response;
  }

}

module.exports = BookingRepository
