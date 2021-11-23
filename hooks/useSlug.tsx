import { useEffect, useState } from "react"
import { uid } from 'uid'

export default function useSlug(initial?: string) {
    const [original, setOriginal] = useState<string>(initial ? initial : '');
    const [slug, setSlug] = useState<string>('');

    // convert original to slug
    useEffect(() => {
        let str = original;
        if(!str) {
            setSlug('');
            return;
        }
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        var from = "àáäãâèéëêìíïîòóöôùúüûñç·/_,:;";
        var to = "aaaaaeeeeiiiioooouuuunc------";
        for (var i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes

        setSlug(str);
    }, [original]);

    return [slug, setOriginal] as const;
}

export function useBackupSlug(slug: string, taken: (newSlug: string) => Promise<boolean>) {
    const [slugTaken, setSlugTaken] = useState(false);
    const [backupSlug, setBackupSlug] = useState('');

    useEffect(() => {
        (async () => {
            if(slug && await taken(slug)) {
                setSlugTaken(true);
            } else {
                setSlugTaken(false);
                setBackupSlug('');
            }
        })();
    }, [slug]);

    useEffect(() => {
        (async () => {
            try {
                if(!slugTaken) return;
                if(!slug) return;

                let found = false;
                const numberMatches = slug.match(/\d+$/);
                const slugStem = slug.replace(/\d+$/, "");
                let index = numberMatches ? parseInt(numberMatches[0]) : 1;
                while(!found) {
                    if(await taken(slugStem + index)) {
                        index++;
                    } else {
                        found = true;
                    }
                }
                setBackupSlug(slugStem + index);
            } catch (error) {

            }
        })();
    }, [slugTaken]);

    return [backupSlug, slugTaken] as const;
}

export function useSlugUID(initial?: string) {
    const [original, setOriginal] = useState<string>(initial ? initial : '');
    const [slug, setSlug] = useState<string>('');
    const [_uid] = useState(uid());

    // convert original to slug
    useEffect(() => {
        let str = original;
        if(!str) {
            setSlug('');
            return;
        }
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        var from = "àáäãâèéëêìíïîòóöôùúüûñç·/_,:;";
        var to = "aaaaaeeeeiiiioooouuuunc------";
        for (var i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes

        setSlug(str + "-" + _uid);
    }, [original]);

    return [slug, setOriginal] as const;
}