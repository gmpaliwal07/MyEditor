'use client';

import { withProps } from '@udecode/cn';
import {
  BoldPlugin,
  ItalicPlugin,
  StrikethroughPlugin,
  UnderlinePlugin,
  CodePlugin,
  SubscriptPlugin,

  SuperscriptPlugin
} from '@udecode/plate-basic-marks/react';

import {FontBackgroundColorPlugin,
  FontColorPlugin,
  FontSizePlugin,
  FontFamilyPlugin,
} from '@udecode/plate-font/react'
import {
  ParagraphPlugin,
  PlateElement,
  PlateLeaf,
  usePlateEditor,
} from '@udecode/plate/react';

import { AnyPluginConfig } from '@udecode/plate';


interface EditorOptions {
  plugins?: AnyPluginConfig[];
  [key: string]: unknown;
}

export const useCreateEditor = (options: EditorOptions = {}) => {
  const { plugins = [], ...rest } = options;
  return usePlateEditor({
    plugins,
    override: {
      components: {
        blockquote: withProps(PlateElement, {
          as: 'blockquote',
       
        }),
        [BoldPlugin.key]: withProps(PlateLeaf, { as: 'strong' }),
        h1: withProps(PlateElement, {
          as: 'h1',
        
        }),
        h2: withProps(PlateElement, {
          as: 'h2',
        
        }),
        h3: withProps(PlateElement, {
          as: 'h3',
         
        }),
        [ItalicPlugin.key]: withProps(PlateLeaf, { as: 'em' }),
        [ParagraphPlugin.key]: withProps(PlateElement, {
          as: 'p',
   
        }),
        [StrikethroughPlugin.key]: withProps(PlateLeaf, { as: 's' }),
        [UnderlinePlugin.key]: withProps(PlateLeaf, { as: 'u' }),
        [CodePlugin.key]: withProps(PlateLeaf, { as: 'code' }),
        [SubscriptPlugin.key]: withProps(PlateLeaf, { as: 'sub' }),
        [SuperscriptPlugin.key]: withProps(PlateLeaf, { as: 'sup' }),
        [FontBackgroundColorPlugin.key]: withProps(PlateLeaf, {
          as: 'span',
          className: 'bg-yellow-100',
        }),
        [FontColorPlugin.key]: withProps(PlateLeaf, {
          as: 'span',
          className: 'text-red-500',
        }),
        [FontSizePlugin.key]: withProps(PlateLeaf, {
          as: 'span',
          className: 'text-lg',
        }),
        [FontFamilyPlugin.key]: withProps(PlateLeaf, {
          as: 'span',
          className: 'font-serif',
        }),
   
      },
    },
    value : [
      {
        type : 'h1',
        children : [
          {
            text : 'Welcome to the editor!',
          },
        ],
      }
    ],
    ...rest,
  });
};
