import express from "express";
import { getPageData, getDetailPost } from "../utils/tmp.js";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Express + TypeScript Server");
});

app.get("/crawl-data", async (req, res) => {
  const data = await getPageData("https://tamanhhospital.vn/benh/page/10/");
  //   const tmpData = await getDetailPost(
  //     "https://tamanhhospital.vn/benh-vien-chay-than-tai-tphcm/"
  //   );
  if (data.length > 0) {
    await Promise.all(
      data
        .filter((item) => item !== undefined && item !== null)
        .map((item) => getDetailPost(item))
    );
    console.log("tmp", "done");
    return res.status(200).json({
      code: 200,
      message: "OK",
      data: "10",
    });
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
