import axios from "axios";

export default async function handler(req, res) {
  try {
    console.log("[INFO] Get user account API called");

    const result = await axios.get(`http://localhost:8080/user`, {
      headers: {
        Authorization: req.headers.authorization,
      },
    });
    res.status(200).json(result.data);
  } catch (error) {
    console.error(error.message);
    return res.status(error.status || 500).end(error.message);
  }
}
