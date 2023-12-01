import ActionsData from "../interfaces/IActionsData";
import NodeCache from "node-cache";

const cache = new NodeCache();

const requestPEOpenData = async (
  year: number,
  url: string,
): Promise<ActionsData> => {
  try {
    const cachedData = await cache.get(`urlPEOpenData${year}`);
    if (typeof cachedData === "string") {
      return JSON.parse(cachedData);
    }

    const fetch = (await import("node-fetch")).default;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Erro na solicitação HTTP: ${response.status} ${response.statusText}`,
      );
    }

    const data: ActionsData = await response.json() as unknown as ActionsData;

    const EXPIRE_IN_ONE_DAY = 86400;
    cache.set(`urlPEOpenData${year}`, JSON.stringify(data), EXPIRE_IN_ONE_DAY);

    return data;
  } catch (error: any) {
    throw new Error(`Erro ao processar os dados: ${error.message}`);
  }
};

export default requestPEOpenData;