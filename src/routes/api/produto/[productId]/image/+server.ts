export async function GET({ params, locals }) {
    const codProd = params.productId;
    const resp = await fetch(`${locals.sankhyaServer}/mge/Produto@IMAGEM@CODPROD=${codProd}.dbimage`);
    const blob = await resp.blob();
    return new Response(blob, {
        headers: {
            'Content-Type': 'image/jpeg'
        }
    });
}