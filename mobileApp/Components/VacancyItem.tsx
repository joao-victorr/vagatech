
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';


interface Props {
  id: string;
  vacancyNumber: number;
  onPress: (id: string) => void;
}
export const VacancyItem = (props: Props) => {

  return (
    <TouchableOpacity onPress={() => props.onPress(props.id)}>
      <View style={styles.item}>
        <Text style={styles.itemText}>{props.vacancyNumber}</Text>
      </View>
    </TouchableOpacity>
  )
}



const styles = StyleSheet.create({
  item: {
    backgroundColor: '#00F',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    
  },

  itemText: {
    fontSize: 20,
    color: '#fff',
  }

});
