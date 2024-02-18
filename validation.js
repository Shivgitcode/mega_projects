const joi = require("joi")


module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().required(),
        body: joi.string().required()

    }).required()


})