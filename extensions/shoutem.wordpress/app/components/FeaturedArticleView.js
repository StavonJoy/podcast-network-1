import React from 'react';
import moment from 'moment';

import {
  Caption,
  Divider,
  ImageBackground,
  Tile,
  Title,
  TouchableOpacity,
  View,
} from '@shoutem/ui';

import { ArticleView } from './ArticleView';

/**
 * A component used to render featured news articles
 */
export class FeaturedArticleView extends ArticleView {
  render() {
    const { title, imageUrl, date, author } = this.props;

    const momentDate = moment(date);
    const dateInfo = momentDate.isAfter(0) ? (
      <Caption styleName="md-gutter-left">
        {momentDate.fromNow()}
      </Caption>
    ) : null;

    return (
      <TouchableOpacity onPress={this.onPress}>
        <View styleName="sm-gutter featured">
          <ImageBackground
            styleName="featured placeholder"
            source={{ uri: imageUrl }}
          >
            <Tile>
              <Title>{(title || '').toUpperCase()}</Title>
              <View styleName="horizontal md-gutter-top" virtual>
                <Caption styleName="collapsible" numberOfLines={1}>{author}</Caption>
                {dateInfo}
              </View>
            </Tile>
          </ImageBackground>
        </View>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }
}