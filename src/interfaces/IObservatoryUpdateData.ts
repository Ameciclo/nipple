interface ItemObservatoryUpdateData {
    id: number;
    attributes: {
      url: string;
      goodActionsTags: string;
      badActionsTags: string;
      createdAt: Date;
      updatedAt: Date;
      publishedAt: Date;
    };
  }
  
  export default interface ObservatoryUpdateData {
    data: ItemObservatoryUpdateData[];
  }
  