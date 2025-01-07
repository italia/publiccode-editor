import { format, parseISO } from "date-fns";
import PublicCode from "./contents/publiccode";
import { removeDuplicate } from "./yaml-upload";


const publicCodeAdapter = ({ defaultValues, publicCode }: { defaultValues: Partial<PublicCode>; publicCode: PublicCode | null }) => {
    if (!publicCode) {
        throw new Error('Public Code import error')
    }

    const values = { ...defaultValues, ...publicCode } as PublicCode;

    const { usedBy, releaseDate } = publicCode

    if (usedBy) {
        values.usedBy = removeDuplicate(usedBy)
    }

    if (releaseDate) {
        console.log(typeof releaseDate, (releaseDate as unknown) instanceof Date)
        if ((releaseDate as unknown) instanceof Date) {
            values.releaseDate = format(releaseDate, 'yyyy-MM-dd')
        }

        if (typeof (releaseDate) === 'string') {
            values.releaseDate = format(parseISO(releaseDate), 'yyyy-MM-dd')
        }
    }

    return values;

}

export default publicCodeAdapter;