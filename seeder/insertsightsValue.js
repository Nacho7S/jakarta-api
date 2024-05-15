const connectMongoDB = require("../libs/mongodb");
const SightsModel = require("../models/sights");

const dataJsonSights = 
  [
    {
      "name": "Monumen Nasional (Monas)",
      "description": "Monumen ikonik di Jakarta yang menggambarkan perjuangan kemerdekaan Indonesia.",
      "location": "Jalan Medan Merdeka Barat, Jakarta Pusat",
      "imageUrl": "https://google.com"
    },
    {
      "name": "Taman Mini Indonesia Indah",
      "description": "Taman besar yang merepresentasikan keragaman budaya dari seluruh provinsi di Indonesia.",
      "location": "Jalan Taman Mini, Jakarta Timur",
      "imageUrl": "https://google.com"
    },
    {
      "name": "Kota Tua Jakarta",
      "description": "Kawasan bersejarah yang menyimpan bangunan-bangunan peninggalan kolonial Belanda.",
      "location": "Kawasan Kota Tua, Jakarta Barat",
      "imageUrl": "https://google.com"
    }
  ]

const runSeeder = async () => {
  connectMongoDB()
  SightsModel.insertMany(dataJsonSights)
}

runSeeder()