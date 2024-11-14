import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Image, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { VacancyItem } from './Components/VacancyItem';
import { UseApi } from './hooks/useApi';


interface Vacancy {
  id: string
  status: 0 | 1,
  clientId?: string | null,
  currentVehicleId?: string | null,
  vacancyTypeId: string
  vacancyNumber: number,
}

const vacancyApi = new UseApi().vacancyApi
export default function App() {
  

  // Estado para armazenar a vaga selecionada e se o painel está visível
  const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);
  const [isInfoVisible, setIsInfoVisible] = useState(false);

  const [vacancyData, setVacancyData] = useState<Array<Vacancy>>([]);

  // Função chamada ao clicar em uma vaga
  const handleVacancy = (id: string) => {
    console.log("Teste")
    const vacancy = vacancyData.find(v => v.id === id);
    if (vacancy) {
      setSelectedVacancy(vacancy);
      setIsInfoVisible(true);
    }
  };

  // Função para fechar o painel de informações
  const handleCloseInfo = () => {
    setIsInfoVisible(false);
  };

  useEffect(() => {
    const getVacancyData = async () => {
      try {
        const data = await vacancyApi.getAll();
        // Verifique se data é realmente um array
        if (Array.isArray(data)) {
          console.log('Data is an array:', data);
          setVacancyData(data);
        } else {
          console.error('Data is not an array:', data);
        }
      } catch (error) {
        console.error("Error fetching vacancy data:", error);
      }
    };
    


    getVacancyData();
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image style={styles.headerImg} source={require("./assets/user.png")}  />
        
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="menu" size={32} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <View style={styles.areaItem}>
          {vacancyData.map((vacancy) => (
            <VacancyItem 
              key={vacancy.id} 
              id={vacancy.id} 
              vacancyNumber={vacancy.vacancyNumber} 
              onPress={handleVacancy} 
            />
          ))}          
        </View>

        {/* Painel de Informações sobre a vaga */}
        
      </View>

      {isInfoVisible && (
          <View style={styles.areaInfo}>
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseInfo}>
              <Ionicons name="close" size={32} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.infoText}>Número da Vaga: {selectedVacancy?.vacancyNumber}</Text>
            {/* <Text style={styles.infoText}>Placa: {selectedVacancy?.numberPlate}</Text>
            <Text style={styles.infoText}>Tipo: {selectedVacancy?.type}</Text> */}
          </View>
        )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight || 0,
    flex: 1,
    backgroundColor: '#999',
  },

  header: {
    width: '100%',
    height: 60,
    backgroundColor: '#444',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10, 
    alignItems: 'center',
  },

  headerImg: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },

  menuButton: {
    padding: 10,
  },

  body: {
    flex: 1,
    backgroundColor: '#888',
    padding: 10,
    justifyContent: 'flex-start',

    position: 'relative',
  },

  areaItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 5,
  },

  areaInfo: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 150,
    backgroundColor: '#444',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    zIndex: 100,
  },

  closeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    
  },

  infoText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
  },
});
