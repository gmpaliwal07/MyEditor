
import {
     BaseBoldPlugin,
        BaseItalicPlugin,
        BaseUnderlinePlugin,
BaseStrikethroughPlugin,
BaseCodePlugin,

BaseSubscriptPlugin,
BaseSuperscriptPlugin,

} from '@udecode/plate-basic-marks'
  
import {
  FontBackgroundColorPlugin,
  FontColorPlugin,
  FontSizePlugin,
  FontFamilyPlugin,
} from '@udecode/plate-font/react';
  // Add or remove plugins based on your needs
  export const editorPlugins = [
    BaseBoldPlugin,
    BaseItalicPlugin,
    BaseUnderlinePlugin,
    BaseStrikethroughPlugin,
    FontBackgroundColorPlugin,
    FontColorPlugin,
    FontSizePlugin,
    BaseCodePlugin,
BaseSubscriptPlugin,
BaseSuperscriptPlugin,
FontFamilyPlugin,


  ];