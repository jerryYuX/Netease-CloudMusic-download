<template>
    <div class="home">
        <el-container style="margin-bottom: 66px">
            <el-header>网易云音乐下载器</el-header>
            <el-main>
                <div id="search_main">
                    <div id="search_content">

                                <el-autocomplete placeholder="请输入歌曲名或歌手名" v-model="search_content"
                                                 :fetch-suggestions="querySearch" id="search_input"></el-autocomplete>


                                <el-button type="primary" @click="search_songs(0)" id="search_button">搜索</el-button>



                    </div>
                    <div id="search_result">
                        <el-table
                                :data="search_result"
                                stripe
                                style="width: 100%"
                                size="mini">
                            <el-table-column


                                    width="580">
                                <template slot-scope="scope">


                                    <el-button type="text" @click="download(scope.row.id)" class="song_name">{{
                                        scope.row.name }}
                                    </el-button>
                                    <el-button type="text" @click="player(scope.row)" class="song_name">播放</el-button>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="artist_name"

                                    width="180">
                            </el-table-column>
                            <el-table-column
                                    prop="album.name"
                            >
                            </el-table-column>
                            <el-table-column

                            >

                                <template slot-scope="scope">

                                    {{ scope.row.duration }}
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-pagination
                                background
                                layout="prev, pager, next"
                                :total="songCount"
                                @current-change="handleCurrentChange"

                        >
                        </el-pagination>
                    </div>
                </div>



            </el-main>
        </el-container>
        <aplayer autoplay="autoplay"
                 :music="music_info"
                 :float="false"
                 :mini="false"
                 style="width: 100%;position: fixed;bottom: 0px;margin: 0px;"
                 ref="player"
        />
    </div>
</template>

<script>
    // @ is an alias to /src

    import {search, get_song_urls, search_suggest,get_album} from '../api/api'
    import Aplayer from 'vue-aplayer'

    export default {
        name: 'home',
        data() {
            return {
                search_content: '',
                search_result: [],
                songCount: 0,
                music_info: {
                    title: '请选择歌曲',
                    artist: '未知',
                    src: '',
                    pic: ''

                }


            }


        },
        components: {

            Aplayer
        },
        methods: {
            search_songs(page) {
                search(this.search_content, page).then(res => {

                    if (res.code == 200) {
                        this.$message.success('搜索成功！');
                        console.log(res);
                        this.songCount = res.result.songCount;


                        this.search_result = this.get_art(res.result.songs);
                        ;


                    }

                })


            },
            get_art(res) {
                for (let i = 0; i < res.length; i++) {
                    res[i].artist_name = '';
                    res[i].duration = this.format(res[i].duration);

                    for (let j = 0; j < res[i].artists.length; j++) {
                        res[i].artist_name = res[i].artist_name + '/' + res[i].artists[j].name;


                    }
                }
                return res;
            },
            format(shijianchuo) {
                var time = new Date(shijianchuo);
                var y = time.getFullYear();
                var m = time.getMonth() + 1;
                var d = time.getDate();
                var h = time.getHours();
                var mm = time.getMinutes();
                var s = time.getSeconds();
                return mm + ':' + s;
            },
            async download(id) {
                let songUrl = '';


                songUrl = await this.get_song_url(id)


                this.$alert("<a href='" + songUrl + "' target='_blank'>点击下载</a>", '确认下载', {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: '关闭',
                    customClass:'dowd_alert'
                });


            },
            async get_song_url(id) {
                let url = '';
                await new Promise((resolve) => {

                    get_song_urls(id).then(res => {
                        url = res.data[0].url;

                        resolve(res.data[0].url);



                    })
                });
                return url;

            },
            async get_album(id){
                get_album(row.album.id).then( res =>{



                    temp.pic = res.album.picUrl;
                    console.log(this.$refs.player);
                    this.music_info = temp;
                    this.$refs.player.thenPlay();


                })

            },
            querySearch(queryString, cb) {
                if (queryString != '') {
                    let results = []
                    search_suggest(queryString).then(res => {

                        for (let i = 0; i < res.result.songs.length; i++) {
                            res.result.songs[i].value = res.result.songs[i].name
                        }
                        console.log(res.result.songs);
                        results = res.result.songs;
                        cb(results);
                    })
                }


                // 调用 callback 返回建议列表的数据

            },
            handleCurrentChange(val) {
                this.search_songs(--val);


            },
            async player(row) {
                let temp = {

                };
                temp.title = row.name;
                temp.artist = row.artist_name;


                get_song_urls(row.id).then(res => {
                    temp.src = `https://music.163.com/song/media/outer/url?${row.id}=${row.id}.mp3`;
                    temp.src = res.data[0].url;





                }).then( ()=>{
                    get_album(row.album.id).then( res =>{



                        temp.pic = res.album.picUrl;
                        console.log(this.$refs.player);
                        this.music_info = temp;
                        this.$refs.player.thenPlay();


                    })

                })


                // this.music_info.src = await this.get_song_url(row.id);







            }


        }
    }
</script>
<style>
    .el-header {
        background-color: #242424;
        color: #fff;
        text-align: center;
        line-height: 60px;
    }

    .el-main {
        background-color: #E9EEF3;
        color: #333;
        text-align: center;
        line-height: 160px;
        vertical-align: center;
        padding-top: 0px !important;
    }

    .el-table__header-wrapper {
        display: none;
    }

    /*.el-table__body-wrapper{*/
    /*padding: 0 40px 0 40px;*/
    /*}*/
    .el-pagination {
        padding-top: 25px !important;
    }

    #search_content {
        /*width: 30%;*/
        /*margin: 0 auto;*/
        /*padding-top: 20px;*/
        /*padding-bottom: -20px;*/
        display: flex;
        align-items: center;
        justify-content: center;
    }

    #search_result {
        padding-bottom: 20px;

    }

    #search_main {
        background-color: white;
        font-size: 12px;
        width: 80%;
        padding: 10px 20px 10px 20px;
        margin: 0 auto;
        /*display: flex;*/
    }
    #search_button{
        flex: 0 0;
    }
    #search_input{

        flex: 1 1 auto;

    }

    .song_name {
        font-size: 12px !important;
    }
    .dowd_alert{
        width: 100px;
    }
    .el-message-box{
        width: 100% !important;
    }
</style>
