<template>
    <div class="container">
        <div class="row">
            <div class="header column">
                <h1>
                    Social Media
                </h1>
                <p>
                    Click any of the buttons in the menu below to fetch the HTTP request. You may view the project on <a
                        href="https://github.com/buwilliams/socialmedia"
                        target="_blank"
                    >GitHub here</a>.
                </p>
            </div>
        </div>
        <div class="row">
            <div class="column column-25">
                <h2>Menu</h2>
                <dl>
                    <dt
                        v-for="(route, idx) in routes"
                        :key="idx"
                    >
                        <a
                            href="#"
                            class="button button-outline"
                            @click.prevent="select(route, idx)"
                        >{{ route.label }}<small v-show="route.selected">&nbsp;(showing)</small></a>
                    </dt>
                    <dt>
                        <a
                            href="#"
                            class="button"
                            @click.prevent="toggleEditor()"
                        >Editor <small v-show="showEditor">&nbsp;(showing)</small></a>
                    </dt>
                </dl>
            </div>
            <div class="column column-75">
                <div v-show="hasMessage">
                    {{ message }}
                </div>
                <div
                    v-show="hasError"
                    class="error"
                >
                    {{ error }}
                </div>
                <div v-show="hasJson">
                    <h2>
                        Showing <a
                            :href="url"
                            target="_blank"
                        >{{ url }}</a>
                    </h2>
                    <pre>
                        <code>{{ json }}</code>
                    </pre>
                </div>
                <div v-show="showEditor">
                    <h2>Editor</h2>
                    <form>
                        <fieldset>
                            <label for="selectedIdField">Choose Like to Edit or choose NEW LIKE to create a new like resource</label>
                            <select
                                id="selectedIdField"
                                v-model="selectedId"
                            >
                                <option
                                    value="none"
                                    :selected="true"
                                >
                                    -- select option --
                                </option>
                                <option
                                    value="new"
                                >
                                    NEW LIKE
                                </option>
                                <option
                                    v-for="(id, idx) in ids"
                                    :key="idx"
                                    :value="id"
                                >
                                    {{ id }}
                                </option>
                            </select>
                            <div class="gray">
                                <div
                                    v-show="selectedId === 'none'"
                                    class="graybg"
                                />
                                <label for="postidField">
                                    Post ID
                                    <small v-show="selectedId !== 'new'">(read only)</small>
                                </label>
                                <input
                                    id="postidField"
                                    v-model="edit.postid"
                                    type="text"
                                    placeholder="Post ID"
                                    :disabled="selectedId !== 'new'"
                                >
                                <label for="userField">
                                    User
                                    <small v-show="selectedId !== 'new'">(read only)</small>
                                </label>
                                <input
                                    id="userField"
                                    v-model="edit.user"
                                    type="text"
                                    placeholder="User"
                                    :disabled="selectedId !== 'new'"
                                >
                                <label for="userField">
                                    Date (<a
                                        href="#"
                                        @click.prevent="edit.date = new Date().toISOString()"
                                    >click here to set to now</a>)
                                </label>
                                <input
                                    id="dateField"
                                    v-model="edit.date"
                                    type="text"
                                    placeholder="Date"
                                >
                                <a
                                    href="#"
                                    class="button"
                                    @click.prevent="save"
                                >Save</a>
                                <a
                                    href="#"
                                    class="button button-outline"
                                    @click.prevent="close"
                                >Close</a>
                                <div
                                    v-show="editorResult !== ''"
                                >
                                    <pre>
                                        <code>{{ editorResult }}</code>
                                    </pre>
                                </div>
                            </div>
                        </fieldset>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import _ from 'lodash';

const SERVER = 'http://localhost:3000/';

export default {
    data: () => ({
        routes: [
            {
                label: 'All Likes',
                url: 'users/1/likes',
                selected: false
            },
            {
                label: 'Most Popular Posts',
                url: 'users/1/likes?summary=popular',
                selected: false
            },
            {
                label: 'Biggest Fans',
                url: 'users/1/likes?summary=fans',
                selected: false
            },
            {
                label: 'Most Popular Days',
                url: 'users/1/likes?summary=popularDays',
                selected: false
            },
            {
                label: 'Streaks',
                url: 'users/1/likes?summary=streaks',
                selected: false
            }
        ],
        json: '',
        message: '',
        error: '',
        url: '',
        showEditor: false,
        allLikes: [],
        selectedId: 'none',
        edit: {},
        editorResult: ''
    }),

    computed: {
        hasMessage() {
            return !_.isEmpty(this.message);
        },

        hasJson() {
            return !_.isEmpty(this.json);
        },

        hasError() {
            return !_.isEmpty(this.error);
        },

        ids() {
            return _.map(this.allLikes, like => like.postid + '_'+ like.user);
        },
    },

    watch: {
        selectedId(val, old) {
            if(val !== old) this.editorResult = '';
            if(!this.selectedId) return {};

            let parts = this.selectedId.split('_');
            let postid = parseInt(parts[0]);
            let user = parts[1];
            let like = _.find(this.allLikes, { postid, user });

            if(like) {
                console.log('found', val);
                this.edit = Object.assign({}, like);
            } else {
                console.log('cannot find', val, this.allLikes);
                this.edit = {
                    postid: 0,
                    user: '',
                    date: new Date().toISOString()
                };
            }
        }
    },

    mounted() {
        this.load();
    },

    methods: {
        async load() {
            this.allLikes = await this.getJson('users/1/likes');
            this.select(this.routes[0], 0);
        },

        reset() {
            _.each(this.routes, route => {
                route.selected = false;
            });
            this.json = '';
            this.error = '';
            this.message ='';
            this.url = '';
        },

        select(route, idx) {
            this.reset();
            this.routes[idx].selected = true;
            this.get(route.url);
        },

        get(url) {
            this.close();
            this.url = SERVER + url;
            this.showEditor = false;
            this.message = 'Loading...';
            this.getJson(url)
                .then(json => {
                    this.json = JSON.stringify(json, null, 4);
                })
                .catch(e => {
                    console.error('get', url, e);
                    this.error = e.toString();
                }).finally(() => {
                    this.message = '';
                });
        },

        async getJson(url) {
            let r = new Request(SERVER + url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                mode: 'cors'
            });
            let resp = await fetch(r);
            return await resp.json();
        },

        async toggleEditor() {
            this.reset();
            let newValue = !this.showEditor;
            if(newValue) this.showEditor = newValue;
            else this.close();
        },

        async save() {
            this.editorResult = '';
            let method = this.selectedId === 'new' ? 'POST' : 'PATCH';
            let data = method === 'PATCH' ? [this.edit] : this.edit;

            let r = new Request(SERVER + 'users/1/likes', {
                method,
                headers: { 'Content-Type': 'application/json' },
                mode: 'cors',
                body: JSON.stringify(data)
            });
            let resp = await fetch(r);
            let json = await resp.json();
            this.editorResult = JSON.stringify(json, null, 4);
            this.allLikes = await this.getJson('users/1/likes');
        },

        close() {
            this.edit = {};
            this.selectedId = 'none';
            this.showEditor = false;
        }
    }
};
</script>

<style lang="postcss" scoped>
.header {
    margin-top: 3rem;
    text-align: center;
}

.gray {
    position: relative;
}

.graybg {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: white;
    opacity: 0.8;
    z-index: 1000;
}

.error {
    color: red;
}
</style>