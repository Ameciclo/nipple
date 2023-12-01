import express from "express";
import NodeCache from "node-cache";
import { requestObservatoryData } from "./service/requestObservatoryData";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", async (req, res) => {
  const cache = new NodeCache();

  const EXPIRE_IN_ONE_DAY = 86400;

  const URL_DATA_2020 =
    "https://dados.pe.gov.br/dataset/38401a88-5a99-4b21-99d2-2d4a36a241f1/resource/5e5e1107-e1ed-4c2c-b258-e19a013f6caa/download";
  const URL_DATA_2021 =
    "https://dados.pe.gov.br/dataset/38401a88-5a99-4b21-99d2-2d4a36a241f1/resource/0a2e8fd7-7a65-46df-bd1b-15f2dfaaded7/download";
  const URL_DATA_2022 =
    "https://dados.pe.gov.br/dataset/38401a88-5a99-4b21-99d2-2d4a36a241f1/resource/55784447-97e8-4fb0-b062-99c368bf6384/download";
  const URL_DATA_2023 =
    "https://dados.pe.gov.br/dataset/38401a88-5a99-4b21-99d2-2d4a36a241f1/resource/bd2f90f2-3cc1-4b46-ab8d-9b15a1b0d453/download";

  try {
    let observatoryData2023 = cache.get("observatoryData2023");
    let observatoryData2022 = cache.get("observatoryData2022");
    let observatoryData2021 = cache.get("observatoryData2021");
    let observatoryData2020 = cache.get("observatoryData2020");

    if (!observatoryData2023) {
      observatoryData2023 = await requestObservatoryData(2023, URL_DATA_2023);
      cache.set("observatoryData2023", observatoryData2023, EXPIRE_IN_ONE_DAY);
    }

    if (!observatoryData2022) {
      observatoryData2022 = await requestObservatoryData(2022, URL_DATA_2022);
      cache.set("observatoryData2022", observatoryData2022, EXPIRE_IN_ONE_DAY);
    }

    if (!observatoryData2021) {
      observatoryData2021 = await requestObservatoryData(2021, URL_DATA_2021);
      cache.set("observatoryData2021", observatoryData2021, EXPIRE_IN_ONE_DAY);
    }

    if (!observatoryData2020) {
      observatoryData2020 = await requestObservatoryData(2020, URL_DATA_2020);
      cache.set("observatoryData2020", observatoryData2020, EXPIRE_IN_ONE_DAY);
    }

    const data = [
      observatoryData2023,
      observatoryData2022,
      observatoryData2021,
      observatoryData2020,
    ];

    res.send(data);
  } catch (error) {
    res.send(error);
  }
});

app.listen(PORT, () => {
  console.log(`Servidor está rodando na porta ${PORT}`);
});
