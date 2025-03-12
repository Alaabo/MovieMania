//track the searches
import {Client, Databases, ID, Query} from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!

const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)

const database = new Databases(client)
export const updateSearchCount =async (query: string , movie: Movie) => {
    //check if a record is already exist
    //if yes just update the count
    //else create new record and initialize it to 1
  try {
      const results = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
          Query.equal('searchTerm', query),
      ])
      if(results.documents.length > 0){
          const existingRecord = results.documents[0]
          await  database.updateDocument(
              DATABASE_ID,
              COLLECTION_ID,
              existingRecord.$id,
              {
                  count: existingRecord.count + 1,}
          )
      }else{
          await database.createDocument(
              DATABASE_ID,
              COLLECTION_ID,
              ID.unique(),
              {
                  searchTerm: query,
                  movie_id: movie.id,
                  count: 1,
                  title : movie.title,
                  poster_url :  `https://image.tmdb.org/t/p/w500/${movie.poster_path}`

              }
          )
      }
  }catch (e) {
      console.log(e)
      throw  e
  }
}
export const getTrendingMovies = async ():Promise<TrendingMovie[] | undefined> => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.limit(5),
            Query.orderDesc("count"),
        ]);

        return result.documents as unknown as TrendingMovie[];
    } catch (error) {
        console.error(error);
        return undefined;
    }

}