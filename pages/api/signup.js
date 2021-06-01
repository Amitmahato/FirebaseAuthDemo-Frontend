import axios from "axios";
export default async function handler(req, res) {
  try {
    console.log("[INFO] User signup API called");
    const result = await axios.post(
      "http://localhost:8080/users/signup",
      req.body
    );
    res.status(200).json(result.data);
  } catch (error) {
    console.error(error.message);
    return res.status(error.status || 500).end(error.message);
  }
}
