import { StyleSheet } from 'react-native';
import DesireList from '../components/desire/DesireList';


export default function DesirePage({ navigation }) {
    
    return (     
        <DesireList navigation={navigation}/>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        padding:15,
        marginBottom:45
    },
});
