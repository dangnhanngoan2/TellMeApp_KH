import { Dimensions, StatusBar } from 'react-native'
import { Header } from 'react-navigation'

const Metrics = {
  WINDOW_WIDTH: Dimensions.get('window').width,
  WINDOW_HEIGHT: Dimensions.get('window').height,
  STATUS_BAR_HEIGHT: StatusBar.currentHeight,
  HEADER_HEIGHT: Header.HEIGHT
}

export default Metrics
