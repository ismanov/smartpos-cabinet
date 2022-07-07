import instance from "../network";
import axios from "axios";
// let BASE_URL = 'http://axios.createsa.uz:9021';
// const simpleInstance = axios.create({ baseURL: BASE_URL });

const simpleInstance = axios.create({});

function Service() {}

Service.prototype.makeQueryParams = function(args) {
  if (!args) return "";
  let firstTime = true;
  return Object.keys(args)
    .map((key) => {
      if (args[key] !== undefined) {
        let result = `${firstTime ? "?" : "&"}${key}=${args[key]}`;
        firstTime = false;
        return result;
      } else {
        return undefined;
      }
    })
    .filter((item) => !!item)
    .join("");
};

Service.prototype.request = function(options) {
  return instance.request(options);
};

Service.prototype.simpleRequest = function(options) {
  return simpleInstance.request(options);
};

export default Service;
