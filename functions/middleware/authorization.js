const adminAuthorization = ((req, res, next) => {
  if (req.user.roles === "Admin") {
    next()
  } else {
    next({name: "forbidden"})
  }
})

module.exports = adminAuthorization