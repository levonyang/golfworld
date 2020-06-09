<template>
  <div class="app-container">

    <el-card class="box-card">
      <h3>商品介绍</h3>
      <el-form ref="product" :rules="rules" :model="product" label-width="150px">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="product.name" />
        </el-form-item>
        <el-form-item label="市场价" prop="officialPrice">
          <el-input v-model="product.officialPrice" placeholder="0.00">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="折扣价" prop="discountPrice">
          <el-input v-model="product.discountPrice" placeholder="0.00">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="是否新品" prop="isNew">
          <el-radio-group v-model="product.isNew">
            <el-radio :label="true">新品</el-radio>
            <el-radio :label="false">非新品</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否热卖" prop="isHot">
          <el-radio-group v-model="product.isHot">
            <el-radio :label="false">普通</el-radio>
            <el-radio :label="true">热卖</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否在售" prop="isOnSale">
          <el-radio-group v-model="product.isOnSale">
            <el-radio :label="true">在售</el-radio>
            <el-radio :label="false">未售</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="商品图片">
          <el-upload
            :action="uploadPath"
            :show-file-list="false"
            :headers="headers"
            :on-success="uploadPicUrl"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif"
          >
            <img v-if="product.picUrl" :src="product.picUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>

        <el-form-item label="宣传画廊">
          <el-upload
            :action="uploadPath"
            :limit="5"
            :headers="headers"
            :on-exceed="uploadOverrun"
            :on-success="handleGalleryUrl"
            :on-remove="handleRemove"
            multiple
            accept=".jpg,.jpeg,.png,.gif"
            list-type="picture-card"
          >
            <i class="el-icon-plus" />
          </el-upload>
        </el-form-item>

        <el-form-item label="关键字">
          <el-tag v-for="tag in keywords" :key="tag" closable type="primary" @close="handleClose(tag)">
            {{ tag }}
          </el-tag>
          <el-input
            v-if="newKeywordVisible"
            ref="newKeywordInput"
            v-model="newKeyword"
            class="input-new-keyword"

            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          />
          <el-button v-else class="button-new-keyword" type="primary" @click="showInput">+ 增加</el-button>
        </el-form-item>

        <el-form-item label="所属分类">
          <el-cascader :options="categoryList" expand-trigger="hover" clearable @change="handleCategoryChange" />
        </el-form-item>

        <el-form-item label="所属品牌商">
          <el-select v-model="product.brandId" clearable>
            <el-option v-for="item in brandList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="商品简介">
          <el-input v-model="product.brief" />
        </el-form-item>

        <el-form-item label="商品详细介绍">
          <editor v-model="product.detail" :init="editorInit" />
        </el-form-item>
      </el-form>
    </el-card>

    <!--    <el-card class="box-card">-->
    <!--      <h3>商品规格</h3>-->
    <!--      <el-row :gutter="20" type="flex" align="middle" style="padding:20px 0;">-->
    <!--        <el-col :span="10">-->
    <!--          <el-radio-group v-model="multipleSpec" @change="specChanged">-->
    <!--            <el-radio-button :label="false">默认标准规格</el-radio-button>-->
    <!--            <el-radio-button :label="true">多规格支持</el-radio-button>-->
    <!--          </el-radio-group>-->
    <!--        </el-col>-->
    <!--        <el-col v-if="multipleSpec" :span="10">-->
    <!--          <el-button :plain="true" type="primary" @click="handleSpecificationShow">添加</el-button>-->
    <!--        </el-col>-->
    <!--      </el-row>-->

    <!--      <el-table :data="specifications">-->
    <!--        <el-table-column property="specification" label="规格名"/>-->
    <!--        <el-table-column property="value" label="规格值">-->
    <!--          <template slot-scope="scope">-->
    <!--            <el-tag type="primary">-->
    <!--              {{ scope.row.value }}-->
    <!--            </el-tag>-->
    <!--          </template>-->
    <!--        </el-table-column>-->
    <!--        <el-table-column property="picUrl" label="规格图片">-->
    <!--          <template slot-scope="scope">-->
    <!--            <img v-if="scope.row.picUrl" :src="scope.row.picUrl" width="40">-->
    <!--          </template>-->
    <!--        </el-table-column>-->
    <!--        <el-table-column-->
    <!--          v-if="multipleSpec"-->
    <!--          align="center"-->
    <!--          label="操作"-->
    <!--          width="250"-->
    <!--          class-name="small-padding fixed-width"-->
    <!--        >-->
    <!--          <template slot-scope="scope">-->
    <!--            <el-button type="danger" size="mini" @click="handleSpecificationDelete(scope.row)">删除</el-button>-->
    <!--          </template>-->
    <!--        </el-table-column>-->
    <!--      </el-table>-->

    <!--      <el-dialog :visible.sync="specVisiable" title="设置规格">-->
    <!--        <el-form-->
    <!--          ref="specForm"-->
    <!--          :rules="rules"-->
    <!--          :model="specForm"-->
    <!--          status-icon-->
    <!--          label-position="left"-->
    <!--          label-width="100px"-->
    <!--          style="width: 400px; margin-left:50px;"-->
    <!--        >-->
    <!--          <el-form-item label="规格名" prop="specification">-->
    <!--            <el-input v-model="specForm.specification"/>-->
    <!--          </el-form-item>-->
    <!--          <el-form-item label="规格值" prop="value">-->
    <!--            <el-input v-model="specForm.value"/>-->
    <!--          </el-form-item>-->
    <!--          <el-form-item label="规格图片" prop="picUrl">-->
    <!--            <el-upload-->
    <!--              :action="uploadPath"-->
    <!--              :show-file-list="false"-->
    <!--              :headers="headers"-->
    <!--              :on-success="uploadSpecPicUrl"-->
    <!--              class="avatar-uploader"-->
    <!--              accept=".jpg,.jpeg,.png,.gif"-->
    <!--            >-->
    <!--              <img v-if="specForm.picUrl" :src="specForm.picUrl" class="avatar">-->
    <!--              <i v-else class="el-icon-plus avatar-uploader-icon"/>-->
    <!--            </el-upload>-->
    <!--          </el-form-item>-->
    <!--        </el-form>-->
    <!--        <div slot="footer" class="dialog-footer">-->
    <!--          <el-button @click="specVisiable = false">取消</el-button>-->
    <!--          <el-button type="primary" @click="handleSpecificationAdd">确定</el-button>-->
    <!--        </div>-->
    <!--      </el-dialog>-->
    <!--    </el-card>-->

    <!--    <el-card class="box-card">-->
    <!--      <h3>商品库存</h3>-->
    <!--      <el-table :data="products">-->
    <!--        <el-table-column property="value" label="货品规格">-->
    <!--          <template slot-scope="scope">-->
    <!--            <el-tag v-for="tag in scope.row.specifications" :key="tag">-->
    <!--              {{ tag }}-->
    <!--            </el-tag>-->
    <!--          </template>-->
    <!--        </el-table-column>-->
    <!--        <el-table-column property="price" width="100" label="货品售价"/>-->
    <!--        <el-table-column property="number" width="100" label="货品数量"/>-->
    <!--        <el-table-column property="url" width="100" label="货品图片">-->
    <!--          <template slot-scope="scope">-->
    <!--            <img v-if="scope.row.url" :src="scope.row.url" width="40">-->
    <!--          </template>-->
    <!--        </el-table-column>-->
    <!--        <el-table-column align="center" label="操作" width="100" class-name="small-padding fixed-width">-->
    <!--          <template slot-scope="scope">-->
    <!--            <el-button type="primary" size="mini" @click="handleProductShow(scope.row)">设置</el-button>-->
    <!--          </template>-->
    <!--        </el-table-column>-->
    <!--      </el-table>-->

    <!--      <el-dialog :visible.sync="productVisiable" title="添加货品">-->
    <!--        <el-form-->
    <!--          ref="productForm"-->
    <!--          :model="productForm"-->
    <!--          status-icon-->
    <!--          label-position="left"-->
    <!--          label-width="100px"-->
    <!--          style="width: 400px; margin-left:50px;"-->
    <!--        >-->
    <!--          <el-form-item label="货品规格列" prop="specifications">-->
    <!--            <el-tag v-for="tag in productForm.specifications" :key="tag">-->
    <!--              {{ tag }}-->
    <!--            </el-tag>-->
    <!--          </el-form-item>-->
    <!--          <el-form-item label="货品售价" prop="price">-->
    <!--            <el-input v-model="productForm.price"/>-->
    <!--          </el-form-item>-->
    <!--          <el-form-item label="货品数量" prop="number">-->
    <!--            <el-input v-model="productForm.number"/>-->
    <!--          </el-form-item>-->
    <!--          <el-form-item label="货品图片" prop="url">-->
    <!--            <el-upload-->
    <!--              :action="uploadPath"-->
    <!--              :show-file-list="false"-->
    <!--              :headers="headers"-->
    <!--              :on-success="uploadProductUrl"-->
    <!--              class="avatar-uploader"-->
    <!--              accept=".jpg,.jpeg,.png,.gif"-->
    <!--            >-->
    <!--              <img v-if="productForm.url" :src="productForm.url" class="avatar">-->
    <!--              <i v-else class="el-icon-plus avatar-uploader-icon"/>-->
    <!--            </el-upload>-->
    <!--          </el-form-item>-->
    <!--        </el-form>-->
    <!--        <div slot="footer" class="dialog-footer">-->
    <!--          <el-button @click="productVisiable = false">取消</el-button>-->
    <!--          <el-button type="primary" @click="handleProductEdit">确定</el-button>-->
    <!--        </div>-->
    <!--      </el-dialog>-->
    <!--    </el-card>-->

    <el-card class="box-card">
      <h3>商品参数</h3>
      <el-button type="primary" @click="handleAttributeShow">添加</el-button>
      <el-table :data="attributes">
        <el-table-column property="attribute" label="商品参数名称" />
        <el-table-column property="value" label="商品参数值" />
        <el-table-column align="center" label="操作" width="100" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="handleAttributeDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :visible.sync="attributeVisiable" title="添加商品参数">
        <el-form
          ref="attributeForm"
          :model="attributeForm"
          status-icon
          label-position="left"
          label-width="100px"
          style="width: 400px; margin-left:50px;"
        >
          <el-form-item label="商品参数名称" prop="attribute">
            <el-input v-model="attributeForm.attribute" />
          </el-form-item>
          <el-form-item label="商品参数值" prop="value">
            <el-input v-model="attributeForm.value" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="attributeVisiable = false">取消</el-button>
          <el-button type="primary" @click="handleAttributeAdd">确定</el-button>
        </div>
      </el-dialog>
    </el-card>

    <div class="op-container">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handlePublish">上架</el-button>
    </div>

  </div>
</template>

<style>
  .el-card {
    margin-bottom: 10px;
  }

  .el-tag + .el-tag {
    margin-left: 10px;
  }

  .input-new-keyword {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

  .avatar-uploader .el-upload {
    width: 145px;
    height: 145px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }

  .avatar {
    width: 145px;
    height: 145px;
    display: block;
  }
</style>

<script>
import { listCatAndBrand, publishProduct } from '@/api/product'
import { createStorage, uploadPath } from '@/api/storage'
import Editor from '@tinymce/tinymce-vue'
import { MessageBox } from 'element-ui'
import { getToken } from '@/utils/auth'

export default {
  name: 'ProductCreate',
  components: { Editor },

  data() {
    return {
      uploadPath,
      newKeywordVisible: false,
      newKeyword: '',
      keywords: [],
      categoryList: [],
      brandList: [],
      product: { picUrl: '', gallery: [], isHot: false, isNew: true, isOnSale: true },
      productVisiable: false,
      productForm: { id: 0, price: 0.00, number: 0, url: '' },
      products: [{ id: 0, price: 0.00, number: 0, url: '' }],
      attributeVisiable: false,
      attributeForm: { attribute: '', value: '' },
      attributes: [],
      rules: {
        name: [{ required: true, message: '商品名称不能为空', trigger: 'blur' }]
      },
      editorInit: {
        language: 'zh_CN',
        height: 500,
        convert_urls: false,
        plugins: ['advlist anchor autolink autosave code codesample colorpicker colorpicker contextmenu directionality emoticons fullscreen hr image imagetools importcss insertdatetime link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus table template textcolor textpattern visualblocks visualchars wordcount'],
        toolbar: ['searchreplace bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat subscript superscript code codesample', 'hr bullist numlist link image charmap preview anchor pagebreak insertdatetime media table emoticons forecolor backcolor fullscreen'],
        images_upload_handler: function(blobInfo, success, failure) {
          const formData = new FormData()
          formData.append('file', blobInfo.blob())
          createStorage(formData).then(res => {
            success(res.data.data.url)
          }).catch(() => {
            failure('上传失败，请重新上传')
          })
        }
      }
    }
  },
  computed: {
    headers() {
      return {
        'X-Admin-Token': getToken()
      }
    }
  },
  created() {
    this.init()
  },

  methods: {
    init: function() {
      listCatAndBrand().then(response => {
        this.categoryList = response.data.data.categoryList
        this.brandList = response.data.data.brandList
      })
    },
    handleCategoryChange(value) {
      this.product.categoryId = value[value.length - 1]
    },
    handleCancel: function() {
      this.$router.push({ path: '/product/product' })
    },
    handlePublish: function() {
      this.product.gallery = JSON.stringify(this.product.gallery)
      const finalProduct = {
        product: this.product,
        specifications: this.specifications,
        products: this.products,
        attributes: this.attributes
      }
      publishProduct(finalProduct).then(response => {
        this.$notify.success({
          title: '成功',
          message: '创建成功'
        })
        this.$router.push({ path: '/product/list' })
      }).catch(response => {
        console.log(response)
        MessageBox.alert('业务错误：' + response.data.errmsg, '警告', {
          confirmButtonText: '确定',
          type: 'error'
        })
      })
    },
    handleClose(tag) {
      this.keywords.splice(this.keywords.indexOf(tag), 1)
      this.product.keywords = this.keywords.toString()
    },
    showInput() {
      this.newKeywordVisible = true
      this.$nextTick(_ => {
        this.$refs.newKeywordInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      const newKeyword = this.newKeyword
      if (newKeyword) {
        this.keywords.push(newKeyword)
        this.product.keywords = this.keywords.toString()
      }
      this.newKeywordVisible = false
      this.newKeyword = ''
    },
    uploadPicUrl: function(response) {
      this.product.picUrl = response.data.url
    },
    uploadOverrun: function() {
      this.$message({
        type: 'error',
        message: '上传文件个数超出限制!最多上传5张图片!'
      })
    },
    handleGalleryUrl(response, file, fileList) {
      if (response.errno === 0) {
        this.product.gallery.push(response.data.url)
      }
    },
    handleRemove: function(file, fileList) {
      for (var i = 0; i < this.product.gallery.length; i++) {
        // 这里存在两种情况
        // 1. 如果所删除图片是刚刚上传的图片，那么图片地址是file.response.data.url
        //    此时的file.url虽然存在，但是是本机地址，而不是远程地址。
        // 2. 如果所删除图片是后台返回的已有图片，那么图片地址是file.url
        var url
        if (file.response === undefined) {
          url = file.url
        } else {
          url = file.response.data.url
        }

        if (this.product.gallery[i] === url) {
          this.product.gallery.splice(i, 1)
        }
      }
    },
    handleProductShow(row) {
      this.productForm = Object.assign({}, row)
      this.productVisiable = true
    },
    uploadProductUrl: function(response) {
      this.productForm.url = response.data.url
    },
    handleProductEdit() {
      for (var i = 0; i < this.products.length; i++) {
        const v = this.products[i]
        if (v.id === this.productForm.id) {
          this.products.splice(i, 1, this.productForm)
          break
        }
      }
      this.productVisiable = false
    },
    handleAttributeShow() {
      this.attributeForm = {}
      this.attributeVisiable = true
    },
    handleAttributeAdd() {
      this.attributes.unshift(this.attributeForm)
      this.attributeVisiable = false
    },
    handleAttributeDelete(row) {
      const index = this.attributes.indexOf(row)
      this.attributes.splice(index, 1)
    }
  }
}
</script>
