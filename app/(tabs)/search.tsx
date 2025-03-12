import {ActivityIndicator, FlatList, Image, ImageBackground, Text, View} from 'react-native';
import {images} from "@/constants/images";
import MovieCard from "@/components/MovieCard";
import useFetch from "@/services/useFetch";
import {fetchMovies} from "@/services/api";
import {SafeAreaView} from "react-native-safe-area-context";
import {icons} from "@/constants/icons";
import SearchBar from "@/components/searchBar";
import {useEffect, useState} from "react";
import {updateSearchCount} from "@/services/appwrite";

const search = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const {
        data: movies = [],
        loading,
        error,
        refetch: loadMovies,
        reset,
    } = useFetch(() => fetchMovies({ query: searchQuery }), false);

    const handleSearch = (text: string) => {
        setSearchQuery(text);
    };

    // Debounced search effect
    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (searchQuery.trim()) {
                await loadMovies();

                // Call updateSearchCount only if there are results
                if (movies?.length! > 0 && movies?.[0]) {
                    await updateSearchCount(searchQuery, movies[0]);
                }
            } else {
                reset();
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    return (
        <View className="flex-1 bg-primary">
            <Image
                source={images.bg}
                className="flex-1 absolute w-full z-0"
                resizeMode="cover"
            />

            <FlatList
                className="px-5"
                data={movies as Movie[]}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <MovieCard {...item} />}
                numColumns={3}
                columnWrapperStyle={{
                    justifyContent: "flex-start",
                    gap: 16,
                    marginVertical: 16,
                }}
                contentContainerStyle={{ paddingBottom: 100 }}
                ListHeaderComponent={
                    <>
                        <View className="w-full flex-row justify-center mt-20 items-center">
                            <Image source={icons.logo} className="w-12 h-10" />
                        </View>

                        <View className="my-5">
                            <SearchBar
                                placeholder="Search for a movie"
                                value={searchQuery}
                                onChangeText={handleSearch}
                            />
                        </View>

                        {loading && (
                            <ActivityIndicator
                                size="large"
                                color="#0000ff"
                                className="my-3"
                            />
                        )}

                        {error && (
                            <Text className="text-red-500 px-5 my-3">
                                Error: {error.message}
                            </Text>
                        )}

                        {!loading &&
                            !error &&
                            searchQuery.trim() &&
                            movies?.length! > 0 && (
                                <Text className="text-xl text-white font-bold">
                                    Search Results for{" "}
                                    <Text className="text-accent">{searchQuery}</Text>
                                </Text>
                            )}
                    </>
                }
                ListEmptyComponent={
                    !loading && !error ? (
                        <View className="mt-10 px-5">
                            <Text className="text-center text-gray-500">
                                {searchQuery.trim()
                                    ? "No movies found"
                                    : "Start typing to search for movies"}
                            </Text>
                        </View>
                    ) : null
                }
            />
        </View>
    );
    // const [query, setQuery] = useState("  ")
    // const {data : movies ,
    //     loading : moviesLoading ,
    //     error : moviesError} = useFetch( ()=>fetchMovies({
    //     query: query,
    // }) )
    // // @ts-ignore
    // // @ts-ignore
    // return (
    //     <>
    //         <ImageBackground
    //             source={images.bg}
    //             resizeMode="cover"
    //             style={{width: '100%', height: '100%'}}
    //             imageStyle={{width: '100%', height: '100%'}}
    //         >
    //             <SafeAreaView className="flex bg-primary justify-center items-center  w-full h-full">
    //
    //                 <FlatList
    //                     data={movies}
    //                     renderItem={({item})=><MovieCard {...item}/>}
    //                     keyExtractor={(item) => item.id.toString()}
    //                     numColumns={3}
    //                     className="px-5"
    //                     columnWrapperStyle={{
    //                         width: "100%",
    //                         justifyContent: "space-between",
    //                         gap: 20,
    //                         paddingRight: 5,
    //                         marginBottom: 10,
    //                     }}
    //                     ListHeaderComponent={
    //                         <>
    //                             <View>
    //                                 <Image source={icons.logo} className="w-12 h-10 mt-20 mb-10 mx-auto"/>
    //                             </View>
    //                             <View className="my-5  ">
    //                                 <SearchBar
    //                                     placeholder="Search for a movie"
    //                                     value={query}
    //                                     onChangeText={(text:string)=>setQuery(text)}
    //                                 />
    //                             </View>
    //                             {moviesLoading && <ActivityIndicator size="large" color="#000ff" className={"my-3"}/>}
    //                             {moviesError && <Text className={"text-white"}>Error: {moviesError?.message}</Text>}
    //                             {!moviesLoading && !moviesError && query.trim() && movies?.length > 0 &&(
    //                                 <Text className={"text-white text-xl font-bold"}>search results for term {'    '}
    //                                     <Text className={"text-accent"}>
    //                                         {query}
    //                                     </Text>
    //                                 </Text>
    //                             )}
    //                         </>
    //                     }
    //                 />
    //
    //
    //             </SafeAreaView>
    //         </ImageBackground>
    //
    //     </>
    // )
}

export default search;
