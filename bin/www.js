const app = require("../app");
const connectMongoDB = require("../config/mongodb");

const PORT = process.env.PORT

connectMongoDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  })
})