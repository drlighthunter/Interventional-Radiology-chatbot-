export async function searchOpenFDA(drugName: string) {
  try {
    const res = await fetch(`https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${encodeURIComponent(drugName)}"&limit=1`);
    if (!res.ok) return { error: "Drug not found or FDA API error." };
    const data = await res.json();
    const result = data.results[0];
    return {
      brand_name: result.openfda?.brand_name?.[0] || drugName,
      generic_name: result.openfda?.generic_name?.[0] || "Unknown",
      warnings: result.warnings?.[0] || result.warnings_and_cautions?.[0] || "No specific warnings listed.",
      contraindications: result.contraindications?.[0] || "None listed.",
      adverse_reactions: result.adverse_reactions?.[0] || "None listed."
    };
  } catch (e) {
    return { error: "Failed to fetch OpenFDA data." };
  }
}

export async function searchPubMed(query: string) {
  try {
    const searchRes = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmode=json&retmax=3`);
    const searchData = await searchRes.json();
    const ids = searchData.esearchresult?.idlist;
    if (!ids || ids.length === 0) return { results: "No articles found." };

    const summaryRes = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids.join(',')}&retmode=json`);
    const summaryData = await summaryRes.json();
    
    const articles = ids.map((id: string) => {
      const article = summaryData.result[id];
      return {
        title: article.title,
        authors: article.authors?.map((a: any) => a.name).join(', '),
        journal: article.fulljournalname,
        pubdate: article.pubdate,
        link: `https://pubmed.ncbi.nlm.nih.gov/${id}/`
      };
    });
    return { articles };
  } catch (e) {
    return { error: "Failed to fetch PubMed data." };
  }
}

export async function searchOSM(query: string, lat?: number, lon?: number) {
  try {
    let url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`;
    const res = await fetch(url, { headers: { 'User-Agent': 'IR-Chatbot/1.0' } });
    const data = await res.json();
    return data.map((item: any) => ({
      name: item.display_name,
      lat: item.lat,
      lon: item.lon,
      type: item.type
    }));
  } catch (e) {
    return { error: "Failed to fetch OpenStreetMap data." };
  }
}

export async function fetchProcedureImage(query: string) {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=3&pithumbsize=800&origin=*`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data.query || !data.query.pages) return { error: "No images found." };
    
    const pages = Object.values(data.query.pages) as any[];
    const images = pages.filter(p => p.thumbnail).map(p => ({
      title: p.title,
      url: p.thumbnail.source
    }));
    
    if (images.length === 0) return { error: "No images found." };
    return { images };
  } catch (e) {
    return { error: "Failed to fetch images." };
  }
}
