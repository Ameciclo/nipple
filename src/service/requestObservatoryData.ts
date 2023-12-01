import requestPEOpenData from "./requestPEOpenData";
import ObservatoryUpdateData from "../interfaces/IObservatoryUpdateData";

const reqLoaclimaObservatoryUpdateData = async (
  url: string
): Promise<ObservatoryUpdateData> => {
  try {
    const fetch = (await import("node-fetch")).default;

    const response = await fetch(url);
    const data: ObservatoryUpdateData =
      (await response.json()) as ObservatoryUpdateData;
    return data;
  } catch (error) {
    throw new Error("Erro ao processar os dados de referencia");
  }
};

const isCurrentYear = (year: number) => {
  const currentDate = new Date();
  const getYear = currentDate.getFullYear();
  return getYear === year;
};

async function requestObservatoryData(year: number, url: string) {
  const actionsData = await requestPEOpenData(year, url);
  const {
    data: [
      {
        attributes: { goodActionsTags, badActionsTags },
      },
    ],
  } = await reqLoaclimaObservatoryUpdateData(
    "https://test.cms.ameciclo.org/api/loaclimaobservatoryupdatedatas"
  );

  const goodActions = actionsData.campos.filter((action) =>
    goodActionsTags
      .split(" ")
      .some((tag) =>
        action.cd_nm_acao ? action.cd_nm_acao.includes(tag) : false
      )
  );
  const badActions = actionsData.campos.filter((action) =>
    badActionsTags
      .split(" ")
      .some((tag) =>
        action.cd_nm_acao ? action.cd_nm_acao.includes(tag) : false
      )
  );

  const allActionsTotalValueBudgeted = Number(
    actionsData.campos
      .reduce((acc, action) => acc + action.vlrdotatualizada, 0)
      .toFixed(2)
  );

  const goodActionsTotalValueBudgeted = Number(
    goodActions
      .reduce((acc, action) => acc + action.vlrdotatualizada, 0)
      .toFixed(2)
  );

  const badActionsTotalValueBudgeted = Number(
    badActions
      .reduce((acc, action) => acc + action.vlrdotatualizada, 0)
      .toFixed(2)
  );

  const goodActionsTotalValueExecuted = Number(
    goodActions.reduce((acc, action) => acc + action.vlrtotalpago, 0).toFixed(2)
  );

  const badActionsTotalValueExecuted = Number(
    goodActions.reduce((acc, action) => acc + action.vlrtotalpago, 0).toFixed(2)
  );

  const totalEmission2020 = 17136035; // valor baseado nos ultimos dados de https://semas.pe.gov.br/inventario-de-gee/
  const totalValueEmissions = Number(
    (allActionsTotalValueBudgeted / totalEmission2020).toFixed(2)
  );

  const pastYearData = {
    year,
    allActionsTotalValueBudgeted,
    goodActionsTotalValueBudgeted,
    badActionsTotalValueBudgeted,
    goodActionsTotalValueExecuted,
    badActionsTotalValueExecuted,
    totalValueEmissions,
  };

  const currentYearData = { ...pastYearData, goodActions, badActions };

  const data = isCurrentYear(year) ? currentYearData : pastYearData;

  return data;
}

export { requestObservatoryData };
