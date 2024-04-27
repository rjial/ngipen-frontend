import type {MaskitoOptions} from '@maskito/core';
import {
    maskitoAddOnFocusPlugin,
    maskitoNumberOptionsGenerator,
    maskitoPrefixPostprocessorGenerator,
    maskitoRemoveOnBlurPlugin,
} from '@maskito/kit';

export const rupiahMask	= maskitoNumberOptionsGenerator({
    decimalSeparator: ',',
    thousandSeparator: '.',
    precision: 2,
    prefix: "Rp "
});