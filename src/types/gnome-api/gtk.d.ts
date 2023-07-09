interface IGtkWidget {
  visible: boolean;
}

interface ICenterBox extends IGtkWidget {
  _todo: any;
  set_center_widget(widget: IGtkWidget | null): void;
}

interface ICenterBoxConstructor {
  new (params: IGtkWidget): ICenterBox;
}

interface IGridParams extends IGtkWidget {
  column_spacing: number;
  row_spacing: number;
}

interface IGridConstructor {
  new (params: IGridParams): IGridParams;
}

interface IGtk {
  CenterBox: ICenterBoxConstructor;
  Grid: IGridConstructor;
}
