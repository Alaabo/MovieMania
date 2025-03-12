import {Dimensions, Image, Text, TouchableOpacity, View} from 'react-native';
import {Link} from "expo-router";
import {icons} from "@/constants/icons";
const { width } = Dimensions.get('window'); // Get screen width
const cardWidth = (width - 80) / 3;
const MovieCard = ({id , poster_path , title , vote_average , release_date}: Movie) => {

    return (

            <Link href={`/movies/${id}`} asChild>

              <TouchableOpacity style={{ width: cardWidth }} className={" rounded-lg"}>

                  <Image
                      source={ {uri: poster_path
                        ?  `https://image.tmdb.org/t/p/w500/${poster_path}`
                        :"https://placehold.co/600x400/1a1a1a/ffffff.png"}}
                         className={" h-52 rounded-lg"}
                        // resizeMode={"cover"}
                  />
                  <Text className={"text-sm font-bold text-white mt-2"} numberOfLines={1}>{title}</Text>
                  <View className={"flex-row items-center justify-start gap-x-1"}>
                      <Image
                      source={icons.star}
                      className={"size-4"}
                      />
                      <Text className={"text-white "} >{Math.round(vote_average / 2)}</Text>

                  </View>
                  <View className={"flex-row items-center justify-start gap-x-1"}>

                      <Text className={"text-xs text-gray-400 font-medium  mt-1 "} >{release_date?.split("-")[0]}</Text>

                  </View>
              </TouchableOpacity>
        </Link>
    )
}

export default MovieCard;
