import theme from '@/utils/theme';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const { width: screenWidth } = Dimensions.get('window');

const BannerCarousel = ({ data, onPress }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);

  const renderBannerItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.bannerItem, { backgroundColor: item.backgroundColor }]}
      onPress={() => onPress && onPress(item)}
      activeOpacity={0.8}
    >
      <Image
        source={typeof item.image === 'string' ? { uri: item.image } : item.image}
        style={styles.bannerImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  const renderPagination = () => (
    <View style={styles.paginationContainer}>
      {data.map((_, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.paginationDot,
            currentIndex === index && styles.activePaginationDot,
          ]}
          onPress={() => {
            carouselRef.current?.scrollTo({ index, animated: true });
          }}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.carouselWrapper}>
        <Carousel
          ref={carouselRef}
          loop
          width={screenWidth}
          height={120}
          autoPlay
          autoPlayInterval={4000}
          data={data}
          scrollAnimationDuration={800}
          style={styles.carousel}
          renderItem={renderBannerItem}
          onSnapToItem={(index) => setCurrentIndex(index)}
          pagingEnabled
          snapEnabled
          mode="horizontal-stack"
          modeConfig={{
            snapDirection: 'left',
            stackInterval: 18,
          }}
        />
      </View>
      {renderPagination()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: theme.spacing.md,
  },
  carouselWrapper: {
    width: screenWidth,
    marginLeft: -theme.spacing.lg,
    marginRight: -theme.spacing.lg,
  },
  carousel: {
    width: '100%',
  },
  bannerItem: {
    width: screenWidth - (theme.spacing.lg * 2),
    height: 120,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginHorizontal: theme.spacing.lg,
    alignSelf: 'center',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },

  // Pagination Styles
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.surface.border,
    opacity: 0.5,
  },
  activePaginationDot: {
    backgroundColor: theme.colors.primary.main,
    opacity: 1,
    width: 24,
    borderRadius: 4,
  },
});

export default BannerCarousel;