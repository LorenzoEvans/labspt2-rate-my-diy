import React, { Component } from 'react';
import ReactCloudinaryUploader from '@app-masters/react-cloudinary-uploader';
import CreatableSelect from 'react-select/lib/Creatable';
import { Mutation } from 'react-apollo';
import { Redirect } from 'react-router';
import { UPDATE_PROJECT } from '../../query/query';
import { GET_PROJECTS } from '../Lists/ProjectList';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

class EditProject extends Component {
  constructor(props) {
    super(props);

    if (this.props.users[0]) {
      const userPull = this.props.users.filter(
        (user) => user.email === this.props.authUser.email
      );
      const { username, email } = userPull[0];
      const categories = this.props.projects.map((project) => project.category);
      let filteredCategories = [...new Set(categories)];

      const {
        name,
        category,
        timestamp,
        titleImg,
        titleBlurb,
        steps,
        id
      } = this.props.project;
      let newSteps = [];
      if (typeof steps === 'string')
        newSteps = JSON.parse(steps).concat([{ type: '', body: '' }]);
      if (!typeof steps === 'string')
        newSteps = steps.concat([{ type: '', body: '' }]);

      this.state = {
        imgDeleteDisabled: true,
        categories: filteredCategories,
        username: username,
        email: email,
        submitDisabled: true,
        project: {
          name: name,
          category: category,
          timestamp: timestamp,
          titleImg: titleImg,
          titleBlurb: titleBlurb,
          steps: newSteps,
          id: id
        }
      };
    } else {
      this.state = {
        imgDeleteDisabled: true,
        categories: [],
        username: '',
        email: '',
        submitDisabled: true,
        project: {
          name: '',
          category: '',
          timestamp: '',
          titleImg: '',
          titleBlurb: '',
          steps: [],
          id: ''
        }
      };
    }
  }

  componentDidMount = () => {
    if (this.props.users[0]) {
      if (typeof this.state.project.steps === 'string') {
        let steps = this.state.project.steps;
        let array = JSON.parse(steps);
        this.setState({
          ...this.state,
          project: { ...this.state.project, steps: array }
        });
      }
    }
  };

  textChange = async (e) => {
    let value = e.target.value;
    await this.setState({
      project: {
        ...this.state.project,
        [e.target.name]: value
      }
    });
  };
  textChangeHandler = (index) => (e) => {
    const newText = this.state.project.steps.map((step, sidx) => {
      if (index !== sidx) return step;
      return { type: 'text', body: e.target.value };
    });

    this.setState({
      project: {
        ...this.state.project,
        steps: newText
      }
    });
  };

  handleAddStep = () => {
    this.setState({
      ...this.state,
      project: {
        ...this.state.project,
        steps: this.state.project.steps.concat([{ type: '', body: '' }])
      }
    });
  };

  addImage = (img) => {
    const steps = this.state.project.steps.filter(
      (step) => step !== { type: '', body: '' }
    );

    const newSteps = steps.concat({ type: 'img', body: img });

    const extraStep = newSteps.concat({ type: '', body: '' });

    this.setState({
      project: {
        ...this.state.project,
        steps: extraStep
      }
    });
  };

  deletePhoto = (idx) => () => {
    const steps = this.state.project.steps.filter(
      (step) => step !== { type: '', body: '' }
    );
    const filtered = steps.filter((step, sidx) => idx !== sidx);
    this.setState({
      project: {
        ...this.state.project,
        steps: filtered
      }
    });
  };

  removeTextStep = (idx) => () => {
    const steps = this.state.project.steps.filter((step, sidx) => idx !== sidx);
    this.setState({
      project: { steps: steps }
    });
  };

  openCloudinary = (e) => {
    e.preventDefault();
    let options = {
      cloud_name: 'dv1rhurfd',
      upload_preset: 'korisbak',
      returnJustUrl: true,
      maxImageWidth: 400,
      maxImageHeight: 500
    };
    ReactCloudinaryUploader.open(options)
      .then((image) => {
        if (this.props.returnJustUrl) image = image.url;
        this.addImage(image);
      })
      .catch((err) => {
        console.error({ error: err });
      });
  };

  mainImage = (e) => {
    e.preventDefault();
    let options = {
      cloud_name: 'dv1rhurfd',
      upload_preset: 'korisbak',
      returnJustUrl: true,
      maxImageWidth: 400,
      maxImageHeight: 500
    };
    ReactCloudinaryUploader.open(options)
      .then((image) => {
        if (this.props.returnJustUrl) image = image.url;
        this.setState({
          imgDeleteDisabled: false,
          project: {
            ...this.state.project,
            titleImg: image
          }
        });
      })
      .catch((err) => {
        console.error({ error: err });
      });
  };

  deleteMainImg = () => {
    this.setState({
      ...this.state,
      imgDeleteDisabled: true,
      project: {
        ...this.state.project,
        category: ''
      }
    });
  };

  handleChange = async (newValue, actionMeta) => {
    let value = '';

    if (newValue !== null) value = await newValue.value;

    await this.setState({
      ...this.state,
      project: {
        ...this.state.project,
        category: value
      }
    });
  };

  finalize = async (e) => {
    e.preventDefault();

    try {
      const steps = await this.state.project['steps'];

      const filter = await steps.filter(
        (step) => step.type !== '' && step.body !== ''
      );

      const string = await JSON.stringify(filter);

      const date = await new Date(Date.now());

      const { name, category, titleImg, titleBlurb, id } = await this.state
        .project;

      await this.setState({
        ...this.state,
        submitDisabled: false,
        project: {
          name: name,
          category: category,
          titleImg: titleImg,
          titleBlurb: titleBlurb,
          steps: string,
          timestamp: date,
          id: id
        }
      });
    } catch (err) {
      console.log({ error: err });
    }
  };

  render() {
    if (this.props.users[0]) {
      const cats = this.state.categories.map((cat) => {
        return { value: cat, label: cat };
      });

      if (
        this.state.project.steps != null &&
        typeof this.state.project.steps === 'object'
      ) {
        return (
          <div className="projectInfoEdit">
            <form className="projectEditForm">
              <h1>{`Edit ${this.state.project.name}`}</h1>
              <div className="project-Flex">
                <h2>project Title:</h2>
                <input
                  type="text"
                  name="name"
                  value={this.state.project.name}
                  onChange={this.textChange}
                />
              </div>
              <div>
                <img src={this.state.project.titleImg} alt="main" />
              </div>
              <button onClick={this.mainImage}>Set Main Image</button>
              <h2>Project Description:</h2>
              <textarea
                className="editProjectDescription"
                rows="6"
                cols="75"
                name="titleBlurb"
                value={this.state.project.titleBlurb}
                onChange={this.textChange}
              />
              <h2>Category:</h2>
              <CreatableSelect
                className="editCategorySelector"
                isClearable
                onChange={this.handleChange}
                onInputChange={this.handleInputChange}
                options={cats}
                value={{
                  value: this.state.project.category,
                  label: this.state.project.category
                }}
              />

              <h2>Steps:</h2>
              <div className="project-step-section">
                <div className="steps-container">
                  {this.state.project['steps'].map((step, idx) => {
                    if (step.type === 'img') {
                      return (
                        <div className="editImageSection" key={idx}>
                          <img src={step.body} alt="step" />
                          <button onClick={this.deletePhoto(idx)}>
                            Delete Photo
                          </button>
                        </div>
                      );
                    } else {
                      return (
                        <div className="inputSection" key={idx}>
                          <input
                            type="text"
                            value={step.body}
                            onChange={this.textChangeHandler(idx)}
                          />
                        </div>
                      );
                    }
                  })}
                </div>
                <div className="buttonSection">
                  {/* <button
														type="button"
														onClick={this.removeTextStep(idx)}
														className="small"
													>
														Delete This Step
													</button> */}
                  <button
                    type="button"
                    onClick={this.handleAddStep}
                    className="small"
                  >
                    Add New Step
                  </button>
                  <button onClick={this.openCloudinary}>Add Picture</button>
                </div>
              </div>
              <button onClick={this.finalize}>Finalize</button>
            </form>
          </div>
        );
      } else {
        let steps = JSON.parse(this.state.project.steps);
        const json = localStorage.getItem('authUser');
        const user = JSON.parse(json);
        const email = user.email;

        return (
          <Mutation
            mutation={UPDATE_PROJECT}
            refetchQueries={() => {
              return [
                {
                  query: GET_PROJECTS,
                  variables: { email: email }
                }
              ];
            }}
          >
            {(editProject, { loading, error, data }) => {
              if (loading) return <span>Submitting your changes...</span>;
              if (error) return <span>{`Error: ${error}`}</span>;
              if (data)
                return <Redirect to={`/${this.state.username}/projects`} />;
              return (
                <div className="projectInfo">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();

                      editProject({
                        variables: {
                          name: this.state.project.name,
                          category: this.state.project.category,
                          timestamp: this.state.project.timestamp,
                          titleImg: this.state.project.titleImg,
                          titleBlurb: this.state.project.titleBlurb,
                          steps: this.state.project.steps,
                          username: this.state.username,
                          id: this.state.project.id
                        }
                      });
                    }}
                  >
                    <div className="projectInfoEdit">
                      <h1>{`Edit ${this.state.project.name}`}</h1>
                      <div className="project-Flex">
                        <h2>Project Title:</h2>
                        <input
                          type="text"
                          name="name"
                          value={this.state.project.name}
                          onChange={this.textChange}
                        />
                      </div>

                      <div>
                        <img src={this.state.project.titleImg} alt="main" />
                      </div>
                      <button onClick={this.mainImage}>Set Main Image</button>
                      <h2>Project Description:</h2>
                      <textarea
                        className="editProjectDescription"
                        rows="6"
                        cols="75"
                        name="titleBlurb"
                        value={this.state.project.titleBlurb}
                        onChange={this.textChange}
                      />
                      <h2>Category:</h2>
                      <CreatableSelect
                        className="editCategorySelector"
                        isClearable
                        onChange={this.handleChange}
                        onInputChange={this.handleInputChange}
                        options={cats}
                        value={{
                          value: this.state.project.category,
                          label: this.state.project.category
                        }}
                      />

                      <div className="project-step-section">
                        <div className="steps-container">
                          {steps.map((step, idx) => {
                            if (step.type === 'img') {
                              return (
                                <div className="editImageSection" key={idx}>
                                  <img src={step.body} alt="step" />
                                </div>
                              );
                            } else {
                              return (
                                <div className="inputSection" key={idx}>
                                  <input
                                    type="text"
                                    value={step.body}
                                    onChange={this.textChangeHandler(idx)}
                                  />
                                </div>
                              );
                            }
                          })}
                        </div>
                      </div>
                      {this.state.submitDisabled ? (
                        <button
                          className="submitButton"
                          type="button"
                          onClick={this.finalize}
                        >
                          Finalize
                        </button>
                      ) : (
                        <button
                          className="submitButton"
                          type="submit"
                          disabled={this.state.submitDisabled}
                        >
                          Submit
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              );
            }}
          </Mutation>
        );
      }
    } else {
      return (
        <div className="projectInfo">
          <form className="projectEditForm">
          <SkeletonTheme highlightColor="#6fb3b8">
            <div className="projectInfoEdit">
              <h1>
                <Skeleton />
              </h1>
              <div className="project-Flex">
                <h2>
                  <Skeleton />
                </h2>
                <Skeleton />
              </div>
              <div className="skeletonImg">
                <Skeleton />
              </div>
              <button>
                <Skeleton />
              </button>
              <h2>
                <Skeleton />
              </h2>
              <div className="editProjectDescription">
                <Skeleton count={6} />
              </div>
              <h2>
                <Skeleton />
              </h2>
              <div className="editCategorySelector">
                <Skeleton />
              </div>
              <div className="project-step-section">
                <div className="steps-container">
                  <div className="inputSection">
                    <Skeleton />
                  </div>
                </div>
              </div>
              <button className="submitButton">
                <Skeleton />
              </button>
              )}
            </div>
            </SkeletonTheme>
          </form>
        </div>
      );
    }
  }
}

export default EditProject;
