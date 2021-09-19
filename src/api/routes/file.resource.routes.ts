import express from 'express';
import { FileResourceController } from '../controllers/file.resource.controller';
import { Loader } from '../../startup/loader';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new FileResourceController();

    //#region Upload routes

    //Routes to upload file resources. One can set various options in the post body.

    //- IsPublicResource - Allow download resource without authentication. Suitable for profile images
    //- IsMultiResolutionImage -
    //        - If the uploaded image is jpeg or png, this option will create and store 3 versions:
    //          1. Original,
    //          2. Preview(640,480) keeping aspect ratio same,
    //          3. Thumbnail (200x200)
    //- References - This option allows to associate references with file resources. References will be associated
    //               in the form of reference item id and reference item type
    //- Tags - This option allows to associate tags with file resources.

    //Upload a new version of existing resource
    //router.post('/upload/:id/version/:version', 
    // authenticator.authenticateClient, authenticator.authenticateUser, controller.uploadVersion);
    router.post('/upload', authenticator.authenticateClient, authenticator.authenticateUser, controller.upload);

    //#endregion

    //#region Download routes

    //Routes to download the file resource

    //Following are query params
    //1. isPublicResource=true
    //2. version=v1. For multi-resolution-images, version=v1-preview or version=v1=thumbnail
    //3. referenceId=<> and optional referenceType=<>
    //4. tag=<>

    // router.get('/search-download', controller.searchAndDownload);
    // router.get('/download/:id/version/:version', controller.downloadByVersion);
    router.get('/download/:id', controller.downloadById);

    //#endregion

    //#region Get resource info routes

    //The following routes will only return the resource metadata. No file downloads!

    //Following are query params
    //1. isPublicResource=true
    //2. version=v1. For multi-resolution-images, version=v1-preview or version=v1=thumbnail
    //3. referenceId=<> and optional referenceType=<>
    //4. tag=<>

    //router.get('/search', controller.search);
    router.get('/:id', controller.getMetadata);

    //#endregion

    //#region Resource deletion

    //Routes to delete resource. These routes will wipe out resources from storage and database.
    //NOTE: Please note that only those resources will be deleted which are owned by requesting user.

    // router.delete('/by-reference/:referenceId',
    //authenticator.authenticateClient, authenticator.authenticateUser, controller.deleteByReference);

    // router.delete('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.delete);

    //#endregion

    app.use('/api/v1/file-resources', router);
};
