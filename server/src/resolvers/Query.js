const { prisma } = require('../generated/prisma-client/');

const Query = {
  getUsers: (parent, args, context) => {
    return context.prisma.users()
  },
  
  GetReviews: (parent,args,context) => {
    return context.prisma.reviews()
  },
  
  getReviewById: (parents, args, context, info) => {
    return context.prisma.review({where: {id: args.id}}, info)
  },
  
  getStars: (parents, args, context) => {
    return context.prisma.stars()
  }
}


module.exports = {
  info,
  getUsers,
  GetReviews,
  getReviewById,
  getStars
}
