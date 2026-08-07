/*
ToDo
----------------------
- Fetch
- Url
- Pametros Url
- Service Name
- method
- headers
- 
*/

export type Parameter = {
    $: string;
    type: "S" | "N" | "D";
}


export abstract class LoadRecord {
    private serviceName = "CRUDServiceProvider.loadRecord";
    constructor (
        protected entityName: string,
        protected fields: string,
        protected expression: string = '',
        protected parameters: Parameter[] = []
    ) {}
        
}
