import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Article } from "../types/Article";

const COLLECTION_NAME = "articles";

// Créer un nouvel article
export async function createArticle(article: Omit<Article, "id">) {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), article);
  return docRef.id;
}

// Récupérer tous les articles
export async function getAllArticles(): Promise<Article[]> {
  const q = query(
    collection(db, COLLECTION_NAME),
    orderBy("publishDate", "desc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as Article)
  );
}

// Récupérer un article par son ID
export async function getArticleById(id: string): Promise<Article | null> {
  const docRef = doc(db, COLLECTION_NAME, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Article;
  }
  return null;
}

// Mettre à jour un article
export async function updateArticle(id: string, data: Partial<Article>) {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, data);
}

// Supprimer un article
export async function deleteArticle(id: string) {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}
