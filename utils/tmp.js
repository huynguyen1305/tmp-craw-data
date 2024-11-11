import axios from "axios";
import puppeteer from "puppeteer";
// import { convertToSlug } from "./convert.js";

export const convertToSlug = (string, separator = "-") => {
  string = string.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  string = string.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  string = string.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  string = string.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  string = string.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  string = string.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  string = string.replace(/đ/g, "d");
  string = string.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  string = string.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  string = string.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  string = string.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  string = string.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  string = string.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  string = string.replace(/Đ/g, "D");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  string = string.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  string = string.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  string = string.replace(/ + /g, " ");
  string = string.trim();
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  string = string.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    " "
  );
  string = string.toLowerCase();
  string = string.replace(/\W+/g, " ");
  string = string.replace(/\s/g, separator);
  return string;
};

export const getDetailPost = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url, {
    timeout: 60000,
    waitUntil: "networkidle0", // đợi đến khi network idle
  });

  const detailPost = await page.evaluate(() => {
    const title = document.querySelector(
      "body > section > div.container > div > div > div:nth-child(1) > div.title > h1"
    )?.textContent;
    const content = document.querySelector("#ftwp-postcontent")?.outerHTML;
    const description = document
      .querySelector("#ftwp-postcontent")
      ?.textContent.slice(0, 200);

    const data = {
      title,
      description,
      slug: title,
      feature_image: null,
      feature_audio: null,
      category: ["test-tam-anh"],
      isPublic: false,
      isVideo: false,
      content,
      author: {
        _id: "65faacc3236af1d3c4e8a1f1",
      },
    };
    return data;
  });

  await axios.post("https://api.ongbatoi.vn/api/post", detailPost);

  await browser.close();

  return detailPost;
};

export const getPageData = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url, {
    timeout: 60000,
    waitUntil: "networkidle0", // đợi đến khi network idle
  });

  await page.setViewport({ width: 370, height: 800 });

  const pageLinks = await page.evaluate(() => {
    const wrapper = document.querySelectorAll(
      "body > div.cat_content.div_over > div > div:nth-child(3) > div > div"
    );
    const elements = Array.from(wrapper);
    const selectedElements = elements.slice(2, 6);

    const links = selectedElements.map((item) => {
      const links = item.querySelectorAll("a.title_post");
      console.log("links", links);
      const allList = Array.from(links).map((link) => {
        console.log("linkMini", link);

        return link?.getAttribute("href");
      });
      return allList;
    });

    return links.flat();
  });

  await browser.close();

  return pageLinks;
};
