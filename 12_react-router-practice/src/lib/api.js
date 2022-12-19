const FIREBASE_DOMAIN =
  'https://react-routing-practice-da368-default-rtdb.europe-west1.firebasedatabase.app';

export const getAllQuotes = async () => {
  const res = await fetch(`${FIREBASE_DOMAIN}/quotes.json`);
  const data = await res.json();

  if (!res.ok) throw new Error(data.message || 'Could not fetch quotes.');

  const transformedQuotes = [];
  for (const key in data) {
    const quoteObj = {
      id: key,
      ...data[key],
    };
    transformedQuotes.push(quoteObj);
  }

  return transformedQuotes;
};

export const getSingleQuote = async (quoteId) => {
  const res = await fetch(`${FIREBASE_DOMAIN}/quotes/${quoteId}.json`);
  const data = await res.json();

  if (!res.ok) throw new Error(data.message || 'Could not fetch quote.');

  const loadedQuote = {
    id: quoteId,
    ...data,
  };

  return loadedQuote;
};

export const addQuote = async (quoteData) => {
  const res = await fetch(`${FIREBASE_DOMAIN}/quotes.json`, {
    method: 'POST',
    body: JSON.stringify(quoteData),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json();

  if (!res.ok) throw new Error(data.message || 'Could not create quote.');

  return null;
};

export const addComment = async (requestData) => {
  const res = await fetch(`${FIREBASE_DOMAIN}/comments/${requestData.quoteId}.json`, {
    method: 'POST',
    body: JSON.stringify(requestData.commentData),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json();

  if (!res.ok) throw new Error(data.message || 'Could not add comment.');

  return { commentId: data.name };
};

export const getAllComments = async (quoteId) => {
  const res = await fetch(`${FIREBASE_DOMAIN}/comments/${quoteId}.json`);

  const data = await res.json();

  if (!res.ok) throw new Error(data.message || 'Could not get comments.');

  const transformedComments = [];
  for (const key in data) {
    const commentObj = {
      id: key,
      ...data[key],
    };
    transformedComments.push(commentObj);
  }

  return transformedComments;
};
