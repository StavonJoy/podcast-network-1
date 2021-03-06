import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import { connectStyle } from '@shoutem/theme';
import { Text, View } from '@shoutem/ui';
import { ext } from '../const';

function SectionHeader({ section, style }) {
  if (_.isEmpty(section.data)) {
    return null;
  }

  return (
    <View style={style.container} styleName="horizontal v-center">
      <Text numberOfLines={1} style={style.text} styleName="bold">{section.title}</Text>
    </View>
  );
}

SectionHeader.propTypes = {
  section: PropTypes.object,
  style: PropTypes.object,
};

export default connectStyle(ext('SectionHeader'))(SectionHeader);
