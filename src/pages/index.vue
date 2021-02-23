<template>
    <div class="container">
        <div class="row">
            <div class="column">
                <h1 class="header">
                    Social Media
                </h1>
            </div>
        </div>
        <div class="row">
            <div class="column">
                <p>
                    Click any of the buttons below to fetch the HTTP request. You may view the project on <a
                        href="https://github.com/buwilliams/socialmedia"
                        target="_blank"
                    >GitHub here</a>.
                </p>
                <a
                    href="#"
                    class="button button-outline"
                    @click.prevent="get('users/1/likes')"
                >All Likes</a>
                <a
                    href="#"
                    class="button button-outline"
                    @click.prevent="get('users/1/likes?summary=popular')"
                >Most popular posts</a>
                <a
                    href="#"
                    class="button button-outline"
                    @click.prevent="get('users/1/likes?summary=fans')"
                >Biggest Fans</a>
                <a
                    href="#"
                    class="button button-outline"
                    @click.prevent="get('users/1/likes?summary=popularDays')"
                >Most popular days</a>
                <a
                    href="#"
                    class="button button-outline"
                    @click.prevent="get('users/1/likes?summary=streaks')"
                >Streaks</a>
                <a
                    href="#"
                    class="button"
                    @click.prevent="toggleEditor()"
                >+</a>
            </div>
        </div>
        <div
            v-show="hasMessage"
            class="row"
        >
            <div class="column">
                {{ message }}
            </div>
        </div>
        <div
            v-show="hasJson"
            class="row"
        >
            <div class="column">
                <p>&nbsp;</p>
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
        </div>
        <div
            v-show="hasError"
            class="row"
        >
            <div class="column error">
                {{ error }}
            </div>
        </div>
        <div
            v-show="showEditor"
            class="row"
        >
            <div class="column">
                <p>&nbsp;</p>
                <h2>Editor</h2>
                <form>
                    <fieldset>
                        <label for="selectedIdField">Choose Like to Edit or choose NEW LIKE</label>
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
                            <label for="userField">Date</label>
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
                                @click.prevent="showEditor = false"
                            >Close</a>
                            <div
                                v-show="editorError !== ''"
                                class="error"
                            >
                                {{ editorError }}
                            </div>
                        </div>
                    </fieldset>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import _ from 'lodash';

const SERVER = 'http://localhost:3000/';

export default {
    data: () => ({
        json: '',
        message: '',
        error: '',
        url: '',
        showEditor: false,
        allLikes: [],
        selectedId: 'none',
        edit: {},
        editorError: ''
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

        selected() {
            if(!this.selectedId) return {};
            let parts = this.selectedId.split('_');
            let postid = parseInt(parts[0]);
            let user = parts[1];
            let like = _.find(this.allLikes, { postid, user });

            return like ? like : {
                postid: 0,
                user: '',
                date: new Date().toISOString()
            };
        }
    },

    watch: {
        selected() {
            this.edit = Object.assign({}, this.selected);
        }
    },

    mounted() {
        this.load();
    },

    methods: {
        async load() {
            this.allLikes = await this.getJson('users/1/likes');
            this.get('users/1/likes');
        },

        reset() {
            this.json = '';
            this.error = '';
            this.message ='';
            this.url = '';
        },

        get(url) {
            this.reset();
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
                headers: { 'Content-Type': 'text/javascript' },
                mode: 'cors'
            });
            let resp = await fetch(r);
            return await resp.json();
        },

        toggleEditor() {
            this.reset();
            this.showEditor = !this.showEditor;
        },

        save() {
            // TODO: implement
        }
    }
};
</script>

<style lang="postcss" scoped>
.header {
    margin-top: 3rem;
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