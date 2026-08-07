import { asyncTryCatch } from "./try-catch";


export const getData = async (url: string, body: object) => {
    let {data, error} = await asyncTryCatch(fetch(url, {
            method: 'POST',
            body: JSON.stringify(body)
        })
    )

    if (error || !data) {
        return {data, error};
    }

    ({ data, error } = await asyncTryCatch(data.json()));
    return {data, error};
}