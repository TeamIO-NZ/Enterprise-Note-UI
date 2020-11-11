import { Plugin } from 'unified';


export declare module 'remark-twemoji';
declare namespace remarkTwemoji {

    type Twemoji = Plugin<[RemarkTwemojiOptions?]>

    interface RemarkTwemojiOptions {
        callback: Function,     // default the common replacer
        attributes: Function,   // default returns {}
        base: string,           // default MaxCDN
        ext: string,            // default ".png"
        className: string,      // default "emoji"
        size: string | number,  // default "36x36"
        folder: string          // in case it's specified
                                // it replaces .size info, if any
    }
}
declare const remarkTwemoji: remarkTwemoji.Twemoji;
export = remarkTwemoji;