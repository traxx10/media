import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableWithoutFeedback
} from "react-native";
import { connect } from "react-redux";
import { selectFilter } from "../../actions";

class FilterPreview extends Component {
  constructor(props) {
    super(props);
    this.renderFilters = this.renderFilters.bind(this);
  }

  renderFilters() {
    const {
      selectedPreview,
      interviewFilters,
      newsFilters,
      selectFilter
    } = this.props;

    if (selectedPreview) {
      if (selectedPreview === "news") {
        return null;
      } else if (selectedPreview === "interview") {
        let filters = interviewFilters.map((data, index) => {
          return (
            <TouchableWithoutFeedback
              onPress={() =>
                selectFilter(interviewFilters, data.resourceName, index)
              }
              key={data.filterName}
            >
              <View
                // key={data.filterName}
                style={[
                  styles.filters,
                  data.selected
                    ? { borderColor: "orange" }
                    : { borderColor: "#fff" }
                ]}
              >
                <Image
                  source={data.uri}
                  resizeMode="contain"
                  style={{
                    height: null,
                    width: null,
                    flex: 1,
                    margin: 5
                  }}
                />
                <View style={{ backgroundColor: "#000" }}>
                  <Text style={{ color: "#fff", textAlign: "center" }}>
                    {data.filterName}
                  </Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          );
        });

        return filters;
      }
    } else return null;
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal>
          {this.renderFilters()}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  filters: {
    flexDirection: "column",
    borderWidth: 2,
    flex: 1,
    borderRadius: 5,
    height: "60%",
    width: 60,
    margin: 10,
    backgroundColor: "#fff"
  }
});

const mapStateToProps = state => {
  return {
    selectedPreview: state.FilterPreviewReducer.selectedPreview,
    interviewFilters: state.FilterPreviewReducer.interviewFilters,
    newsFilters: state.FilterPreviewReducer.newsFilters
  };
};

export default connect(
  mapStateToProps,
  { selectFilter }
)(FilterPreview);
