export async function validateDisabilityServer(data: FormData): Promise<{ success: boolean; errors?: string[] }> {
    const res = await fetch('/api/disability/validate', {
      method: 'POST',
      body: data
    });
    return res.json();
  }
  